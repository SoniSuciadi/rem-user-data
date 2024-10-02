import { crmUpdate, dbPocketbase } from 'src/common/helpers/crm.helper';
import {
  CreatePricelistDto,
  GetFormPricelist,
  GetFormPricelistById,
  GetPricelistDto,
} from './dto/pricelist.dto';
import { BadRequestException } from '@nestjs/common';

export class PricelistService {
  async getPricelist(arg: GetPricelistDto) {
    const { projectId } = arg;
    const project = await dbPocketbase({
      q: `SELECT 
            p."id" 
          FROM cms_projects p 
          WHERE p.id = '${projectId}'`,
    });
    if (!project) throw new BadRequestException(`Proyek tidak ada`);

    const qMain = `
    SELECT
      mp.id,
      mp."name" AS name,
      mp."startDate" AS "startDate",
      mp."endDate" AS "endDate",
      COALESCE(json_extract(mp."detail", '$.installmentPeriod'), 0) AS "simulasiLamaCicilanKPR",
      COALESCE(json_extract(mp."detail", '$.kprCost'), 0) AS "simulasiPerkiraanBungaKPR",
      mp.status
    FROM cms_main_pricelist mp
    WHERE mp."projectId" = '${projectId}'
    ORDER BY 
    CASE 
        WHEN mp.status = 'Aktif' THEN 1
        WHEN mp.status = 'Draft' THEN 2
        WHEN mp.status = 'Expired' THEN 3
        ELSE 4
    END,
    mp."name" ASC
    `;

    const qPricelist = `
    SELECT
      p.id,
      COALESCE(json_extract(p."detail", '$.name'), '') AS name,
      COALESCE(json_extract(p."documentPriceList", '$.uploadRelativePath'), '') AS "document",
      COALESCE(json_extract(p."detail", '$.howToOrder'), '') AS "caraPemesanan",
      COALESCE(json_extract(p."detail", '$.notes'), '') AS "catatan",
      COALESCE(json_extract(p."detail", '$.requirementDocumentKpr'), '') AS "dokumenPersyaratanKPR",
      p.nup AS "amount",
      p."typeNUP" AS "typeNUP",
      p.main_pricelist_id
    FROM cms_pricelist p
    WHERE p."projectId" = '${projectId}'
    `;

    const qClusterType = `
    SELECT
      p.id,
      p.sell,
      c.name || ' - ' || hd."homeDesignName" || ' (' || hd."typeUnit" || ')' AS name,
      COALESCE(json_extract(p."detailClusterAndUnit", '$.listingPrice'), 0) AS "price",
      COALESCE(json_extract(p."detailClusterAndUnit", '$.kprCosts'), 0) AS "kprCosts",
      COALESCE(json_extract(p."detailClusterAndUnit", '$.notaryFee'), 0) AS "notaryFee",
      COALESCE(json_extract(p."detailClusterAndUnit", '$.dpPrice'), 0) AS "dpPrice",
      COALESCE(json_extract(p."detailClusterAndUnit", '$.description'), '') AS "keterangan",
      p."pricelistId"
    FROM cms_cluster_and_units_pricelist p
    JOIN cms_pricelist pricelist ON p."pricelistId" = pricelist.id
    JOIN cms_clusters c ON p."clusterId" = c.id
    JOIN cms_home_design hd ON p."homeDesignId" = hd.id
    WHERE pricelist."projectId" = '${projectId}'
    ORDER BY 
      CASE 
          WHEN p.sell = true THEN 1
          ELSE 4
      END,
      c.name, hd."homeDesignName", hd."typeUnit"
    `;

    const queryDBParallelResult = await Promise.allSettled([
      dbPocketbase({ q: qMain }),
      dbPocketbase({ q: qPricelist }),
      dbPocketbase({ q: qClusterType }),
    ]);
    const [main, pricelist, prices] = queryDBParallelResult.map((result) =>
      result.status === 'fulfilled' ? result.value : [],
    );
    pricelist.forEach((ex) => {
      ex.listHarga = prices?.filter((el) => el.pricelistId === ex.id);
      if (ex.document && !ex.document?.includes('http')) {
        ex.document = `https://fm.prod.marketa.id/uploads/${ex.document}`;
      }
      ex.caraPemesanan = ex?.caraPemesanan?.valueText || '';
      ex.catatan = ex?.catatan?.valueText || '';
      ex.dokumenPersyaratanKPR = ex?.dokumenPersyaratanKPR?.valueText || '';
    });
    main.forEach((ex) => {
      ex.listTipe = pricelist?.filter((el) => el.main_pricelist_id === ex.id);
    });

    return main || [];
  }

  async getFormPricelist(arg: GetFormPricelist) {
    const { projectId } = arg;

    const project = await dbPocketbase({
      q: `SELECT 
            p."abbreviation" 
          FROM cms_projects p 
          WHERE p.id = '${projectId}'`,
    });
    const abbreviation = project?.[0]?.abbreviation;
    if (!abbreviation) throw new BadRequestException(`Proyek tidak ada`);

    const months = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth(); // Mengambil index bulan (0-11)
    const year = currentDate.getFullYear();
    let tempName = `PL ${abbreviation} ${months[currentMonthIndex]} ${year}`;
    const findSameName = await dbPocketbase({
      q: `
      SELECT 
        p.name 
      FROM cms_main_pricelist p
      WHERE p."projectId" = '${projectId}'
        AND p.name LIKE '%${tempName}%'
    `,
    });
    if (findSameName && findSameName?.length)
      tempName = tempName + ` (${findSameName.length + 1})`;

    const getClusterType = await dbPocketbase({
      q: `
      SELECT
        u."clusterId",
        u."homeDesignId",
        c.name || ' - ' || hd."homeDesignName" || ' (' || hd."typeUnit" || ')' AS name
      FROM cms_units u
      JOIN cms_clusters c ON u."clusterId" = c.id
      JOIN cms_home_design hd ON u."homeDesignId" = hd.id
      WHERE c."projectId" = '${projectId}'
      GROUP BY u."clusterId", u."homeDesignId", c.name, hd."typeUnit"
      ORDER BY c.name, hd."homeDesignName", hd."typeUnit"
      `,
    });
    const listHarga = getClusterType?.map((ex) => {
      return {
        name: ex?.name,
        id: `${ex?.clusterId}-${ex?.homeDesignId}`,
        sell: false,
        price: 0,
        kprCosts: 0,
        notaryFee: 0,
        keterangan: '',
      };
    });

    return {
      name: tempName,
      projectId,
      simulasiPerkiraanBungaKPR: 10,
      simulasiLamaCicilanKPR: 5,
      listTipe: [
        {
          name: 'Standart',
          amount: 0,
          typeNUP: 'NUP',
          document: '',
          caraPemesanan: '',
          catatan: '',
          dokumenPersyaratanKPR: '',
          listHarga,
        },
      ],
    };
  }

  async getFormPricelistById(arg: GetFormPricelistById) {
    const { pricelistId } = arg;
    const qMain = `
    SELECT
      mp.id,
      mp."name" AS name,
      mp."projectId",
      COALESCE(json_extract(mp."detail", '$.installmentPeriod'), 0) AS "simulasiLamaCicilanKPR",
      COALESCE(json_extract(mp."detail", '$.kprCost'), 0) AS "simulasiPerkiraanBungaKPR",
      mp.status
    FROM cms_main_pricelist mp
    WHERE mp."id" = '${pricelistId}'
    `;
    const main = await dbPocketbase({ q: qMain });
    if (!main) throw new BadRequestException(`Invalid pricelistId`);
    const projectId = main?.[0]?.projectId;

    const qPricelist = `
    SELECT
      p.id,
      COALESCE(json_extract(p."detail", '$.name'), '') AS name,
      COALESCE(json_extract(p."documentPriceList", '$.uploadRelativePath'), '') AS "document",
      COALESCE(json_extract(p."detail", '$.howToOrder'), '') AS "caraPemesanan",
      COALESCE(json_extract(p."detail", '$.notes'), '') AS "catatan",
      COALESCE(json_extract(p."detail", '$.requirementDocumentKpr'), '') AS "dokumenPersyaratanKPR",
      p.nup AS "amount",
      p."typeNUP" AS "typeNUP"
    FROM cms_pricelist p
    WHERE p."main_pricelist_id" = '${pricelistId}'
    `;

    const qClusterType = `
    SELECT
      p.sell,
      c.name || ' - ' || hd."homeDesignName" || ' (' || hd."typeUnit" || ')' AS name,
      COALESCE(json_extract(p."detailClusterAndUnit", '$.listingPrice'), 0) AS "price",
      COALESCE(json_extract(p."detailClusterAndUnit", '$.kprCosts'), 0) AS "kprCosts",
      COALESCE(json_extract(p."detailClusterAndUnit", '$.notaryFee'), 0) AS "notaryFee",
      COALESCE(json_extract(p."detailClusterAndUnit", '$.dpPrice'), 0) AS "dpPrice",
      COALESCE(json_extract(p."detailClusterAndUnit", '$.description'), '') AS "keterangan",
      p."clusterId" || '-' || p."homeDesignId" AS id,
      p."pricelistId"
    FROM cms_cluster_and_units_pricelist p
    JOIN cms_pricelist pricelist ON p."pricelistId" = pricelist.id
    JOIN cms_clusters c ON p."clusterId" = c.id
    JOIN cms_home_design hd ON p."homeDesignId" = hd.id
    WHERE pricelist."main_pricelist_id" = '${pricelistId}'
    ORDER BY 
      CASE 
          WHEN p.sell = true THEN 1
          ELSE 4
      END,
      c.name, hd."homeDesignName", hd."typeUnit"
    `;

    const qClusterTypeProject = `
    SELECT
      u."clusterId",
      u."homeDesignId",
      c.name || ' - ' || hd."homeDesignName" || ' (' || hd."typeUnit" || ')' AS name,
    FROM cms_units u
    JOIN cms_clusters c ON u."clusterId" = c.id
    JOIN cms_home_design hd ON u."homeDesignId" = hd.id
    WHERE c."projectId" = '${projectId}'
    GROUP BY u."clusterId", u."homeDesignId", c.name, hd."typeUnit"
    ORDER BY c.name, hd."homeDesignName", hd."typeUnit"
  `;

    const queryDBParallelResult = await Promise.allSettled([
      dbPocketbase({ q: qPricelist }),
      dbPocketbase({ q: qClusterType }),
      dbPocketbase({ q: qClusterTypeProject }),
    ]);

    const [pricelist, prices, getClusterType] = queryDBParallelResult.map(
      (result) => (result.status === 'fulfilled' ? result.value : []),
    );
    const tempPrices = getClusterType?.map((ex) => {
      return {
        name: ex?.name,
        id: `${ex?.clusterId}-${ex?.homeDesignId}`,
        sell: false,
        price: 0,
        kprCosts: 0,
        notaryFee: 0,
        keterangan: '',
      };
    });

    pricelist.forEach((ex) => {
      const tempList = prices?.filter((el) => el.pricelistId === ex.id);
      tempPrices.forEach((el) => {
        const findSame = tempList.find((e) => el.id === e.id);
        if (!findSame) {
          console.log(el.id, 'data tidak ada');
          tempList.push(el);
        }
      });
      ex.listHarga = tempList;

      if (ex.document && !ex.document?.includes('http')) {
        ex.document = `https://fm.prod.marketa.id/uploads/${ex.document}`;
      }
      ex.caraPemesanan = ex?.caraPemesanan?.valueText || '';
      ex.catatan = ex?.catatan?.valueText || '';
      ex.dokumenPersyaratanKPR = ex?.dokumenPersyaratanKPR?.valueText || '';
    });

    const result = {
      name: main?.[0]?.name ? main?.[0]?.name + ' Duplikat' : '',
      projectId: main?.[0]?.projectId,
      simulasiPerkiraanBungaKPR: main?.[0]?.simulasiPerkiraanBungaKPR,
      simulasiLamaCicilanKPR: main?.[0]?.simulasiLamaCicilanKPR,
      listTipe: pricelist?.map((ex) => {
        return {
          name: ex?.name || '',
          amount: ex?.amount || 0,
          typeNUP: ex?.typeNUP || 'NUP',
          document: ex?.document || '',
          caraPemesanan: ex?.caraPemesanan || '',
          catatan: ex?.catatan || '',
          dokumenPersyaratanKPR: ex?.dokumenPersyaratanKPR || '',
          listHarga: ex?.listHarga?.map((el) => {
            return {
              id: el?.id,
              name: el?.name || '',
              sell: el?.sell || false,
              price: el?.price || 0,
              kprCosts: el?.kprCosts || 0,
              notaryFee: el?.notaryFee || 0,
              keterangan: el?.keterangan || '',
            };
          }),
        };
      }),
    };
    return result;
  }

  async createPricelist(arg: CreatePricelistDto) {
    const {
      projectId,
      name,
      simulasiPerkiraanBungaKPR,
      simulasiLamaCicilanKPR,
      listTipe,
    } = arg;
    const qProject = `SELECT p."id", p.name FROM cms_projects p WHERE p.id = '${projectId}'`;
    const project = await dbPocketbase({ q: qProject });
    if (!project) throw new BadRequestException(`Invalid projectId`);
    const qFindSameName = `SELECT p.name FROM cms_main_pricelist p WHERE p.name = '${name?.trim()}' AND p."projectId" = '${projectId}'`;
    const qPaymentTypes = `SELECT pt.id, pt.name FROM cms_payment_types pt`;
    const qClusterType = `
    SELECT
      u."clusterId" || '-' || u."homeDesignId" AS id,
      u."clusterId",
      u."homeDesignId",
      hd."typeUnit" AS "unitType",
      c.name AS name
    FROM cms_units u
    JOIN cms_clusters c ON u."clusterId" = c.id
    JOIN cms_home_design hd ON u."homeDesignId" = hd.id
    WHERE c."projectId" = '${projectId}'
    GROUP BY u."clusterId", u."homeDesignId", c.name, hd."typeUnit"
    ORDER BY c.name, hd."homeDesignName", hd."typeUnit"`;

    const queryDBParallelResult = await Promise.allSettled([
      dbPocketbase({ q: qFindSameName }),
      dbPocketbase({ q: qPaymentTypes }),
      dbPocketbase({ q: qClusterType }),
    ]);
    const [sameName, getPaymentTypes, clusterType] = queryDBParallelResult.map(
      (result) => (result.status === 'fulfilled' ? result.value : []),
    );
    if (sameName) throw new BadRequestException(`Nama tidak tersedia`);
    if (!clusterType)
      throw new BadRequestException(
        `Tidak ada unit pada Proyek ${project?.[0]?.name || ''}`,
      );

    // validasi clusterId dan homeDesignId
    listTipe.forEach((ex) => {
      ex.listHarga.forEach((el) => {
        const isExist = clusterType?.find((e) => e.id === el.id);
        const [clusterId, homeDesignId] = el.id.split('-');
        if (!isExist) {
          throw new BadRequestException(
            `clusterId '${clusterId}' dan homeDesignId '${homeDesignId}' pada Tipe '${ex.name}' tidak tersedia pada Proyek ${project?.[0]?.name || ''}`,
          );
        }
      });
    });

    const paymentTypes = getPaymentTypes?.map((ex) => ex.id);
    let main_pricelist_id = '';
    const pricelists = [];
    for (let i = 0; i < listTipe.length; i++) {
      const element = listTipe[i];
      let pricelistId = '';
      const clusterAndUnitPricelistId = [];
      const dataPricelist = {
        main_pricelist_id: main_pricelist_id,
        pricelistName: name?.trim() + ' ' + element?.name?.trim(),
        takeEffectDate: new Date(),
        kprInterestSimulation: simulasiPerkiraanBungaKPR,
        durationKprSimulation: simulasiLamaCicilanKPR,
        homeTypeAmount: clusterType.length,
        status: 'Active',
        projectId: projectId,
        nup: element.amount,
        paymentTypes: paymentTypes,
        typeNUP: element.typeNUP === 'NUP' ? 'NUP' : 'BOOKING_FEE',
        documentPriceList: {
          filename: element?.document?.trim().split('/')?.[
            element?.document?.trim()?.split('/').length - 1
          ],
          uploadRelativePath: element?.document
            ?.trim()
            ?.includes('https://fm.prod.marketa.id/uploads/')
            ? element?.document
                ?.trim()
                ?.split('https://fm.prod.marketa.id/uploads/')?.[1] || ''
            : element?.document?.trim(),
        },
        detail: {
          name: element?.name?.trim() || '',
          type:
            element?.name?.trim()?.split(' ')?.join('')?.toUpperCase() || '',
          howToOrder: {
            valueHtml: element.caraPemesanan || '',
            valueText: element.caraPemesanan || '',
          },
          notes: {
            valueHtml: element.catatan || '',
            valueText: element.catatan || '',
          },
          requirementDocumentKpr: {
            valueHtml: element.dokumenPersyaratanKPR || '',
            valueText: element.dokumenPersyaratanKPR || '',
          },
        },
      };
      // console.log(dataPricelist, 'dataPricelist');
      for (let j = 0; j < clusterType.length; j++) {
        const el = clusterType[j];
        const findPrice = element?.listHarga?.find((ex) => ex.id === el.id);

        const dataCreatePrice = {
          clusterId: el?.clusterId,
          pricelistId: pricelistId,
          sell: findPrice?.sell || false,
          projectId: projectId,
          homeDesignId: el?.homeDesignId,
          detailClusterAndUnit: {
            clusterId: el?.clusterId || '',
            description: findPrice?.keterangan || '',
            dpPrice: 0,
            kprCosts: findPrice?.kprCosts || 0,
            kprInstallment: 0,
            listingPrice: findPrice?.price || 0,
            name: el?.name,
            notaryFee: findPrice?.notaryFee || 0,
            plafondKpr: 0,
            unitId: el?.homeDesignId || '',
            unitType: el?.unitType || '',
          },
        };
        console.log(dataCreatePrice, 'dataCreatePrice');
      }
    }
    // console.log(clusterType, 'clusterType');

    // const updateMain = await crmUpdate({
    //   collection: 'cms_main_pricelist',
    //   data: {
    //   },
    //   id: '',
    // });
    // console.log(updateMain);

    return {};
  }
}
