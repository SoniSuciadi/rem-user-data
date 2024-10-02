import { dbPocketbase } from 'src/common/helpers/crm.helper';
import {
  CreatePricelistDto,
  GetFormPricelist,
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
      c.name || ' (' || hd."typeUnit" || ')' AS name,
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
      if (ex?.caraPemesanan?.valueText)
        ex.caraPemesanan = ex?.caraPemesanan?.valueText || '';
      if (ex?.catatan?.valueText) ex.catatan = ex?.catatan?.valueText || '';
      if (ex?.dokumenPersyaratanKPR?.valueText)
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
        c.name || ' (' || hd."typeUnit" || ')' AS name
      FROM cms_units u
      JOIN cms_clusters c ON u."clusterId" = c.id
      JOIN cms_home_design hd ON u."homeDesignId" = hd.id
      WHERE c."projectId" = '${projectId}'
      GROUP BY u."clusterId", u."homeDesignId", c.name, hd."typeUnit";
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
          listHarga,
        },
      ],
    };
  }

  async createPricelist(arg: CreatePricelistDto) {
    const { projectId } = arg;
    const project = await dbPocketbase({
      q: `
    SELECT p."*" FROM cms_projects p WHERE p.id = '${projectId}'
    `,
    });
    if (!project) throw new BadRequestException(``);
  }
}
