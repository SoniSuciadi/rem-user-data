import { dbPocketbase } from 'src/common/helpers/crm.helper';

export class HomeDesignService {
  async gethomeDesign() {
    const q = `
    SELECT
      hd."homeDesignName" AS "name",
      hd."typeUnit" AS "Tipe"
    FROM cms_home_design hd
    `;
    const data = await dbPocketbase({ q });
    return data || [];
  }
}
