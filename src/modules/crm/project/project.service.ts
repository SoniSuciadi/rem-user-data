import axios from 'axios';
import { dbPocketbase } from 'src/common/helpers/crm.helper';
export class ProjectService {
  async getProjects() {
    const q = `
    SELECT
      p.id,
      p.name,
      p."abbreviation",
      COALESCE(json_extract(p."developerInformation", '$.address'), '') AS "officeAddress",
      COALESCE(json_extract(p."developerInformation", '$.name'), '') AS "ptName",
      COALESCE(json_extract(p."developerInformation", '$.projectAddress'), '') AS "projectAddress",
      COALESCE(json_extract(p."bprs_bank_information", '$.accountName'), '') AS "accountNameBprs",
      COALESCE(json_extract(p."bprs_bank_information", '$.accountNumber'), '') AS "accountNumberBprs",
      COALESCE(json_extract(p."bprs_bank_information", '$.bankName'), '') AS "bankNameBprs",
      COALESCE(json_extract(p."other_bank_information", '$.accountName'), '') AS "accountNameOther",
      COALESCE(json_extract(p."other_bank_information", '$.accountNumber'), '') AS "accountNumberOther",
      COALESCE(json_extract(p."other_bank_information", '$.bankName'), '') AS "bankNameOther",
      p."isExternal"
    FROM cms_projects p
    `;
    const data = await dbPocketbase({ q });
    console.log(data);
    return [];
  }
}
