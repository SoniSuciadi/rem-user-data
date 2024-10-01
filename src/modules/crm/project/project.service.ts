import axios from 'axios';
import { dbPocketbase } from 'src/common/helpers/crm.helper';
import { CreateProjectDto } from './dto/project.dto';
import { join } from 'path';
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
    return data || [];
  }

  async createProject(arg: CreateProjectDto) {
    const {
      name,
      isExternal,
      accountNumberBprs,
      bankNameBprs,
      accountNameBprs,
      accountNameOther,
      accountNumberOther,
      bankNameOther,
      retentionPeriod,
    } = arg;
    // console.log(arg, 'arg');
    const getInitials = (input: string): string =>
      input
        .trim()
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase();
    const abbreviation = getInitials(name);
    let subId = 'test';
    if (isExternal) subId = name?.trim().split(' ').join('');

    const bprs_bank_information = {
      accountNumber: accountNumberBprs || '',
      bankName: bankNameBprs || '',
      accountName: accountNameBprs || '',
    };
    const other_bank_information = {
      accountNumber: accountNumberOther || '',
      bankName: bankNameOther || '',
      accountName: accountNameOther || '',
    };
    const dataCreate = {
      name,
      abbreviation,
      subId,
      isExternal,
      bprs_bank_information,
      other_bank_information,
      retentionPeriod: retentionPeriod || 0,
    };
    console.log(dataCreate);
  }
}
