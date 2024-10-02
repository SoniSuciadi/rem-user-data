import { dbPocketbase } from 'src/common/helpers/crm.helper';
import { GetPricelistDto } from './dto/pricelist.dto';

export class PricelistService {
  async getPricelist(arg: GetPricelistDto) {
    const { projectId } = arg;
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
      p.nup AS "nup",
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
    });
    main.forEach((ex) => {
      ex.listTipe = pricelist?.filter((el) => el.main_pricelist_id === ex.id);
    });

    return main || [];
  }
}
