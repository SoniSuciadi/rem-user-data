import { crmCreate, dbPocketbase } from 'src/common/helpers/crm.helper';
import { CreateHomeDesignDto } from './dto/homeDesign.dto';
import { BadRequestException } from '@nestjs/common';

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

  async createHomeDesign(arg: CreateHomeDesignDto) {
    const { name, buildingArea, fieldWidth, fieldLength } = arg;

    const findSameName = await dbPocketbase({
      q: `
      SELECT
        hd.id
      FROM cms_home_design hd
      WHERE hd."homeDesignName" = '${name}'
    `,
    });
    if (findSameName) throw new BadRequestException(`Nama ${name} sudah ada`);

    const detailUnit = {
      bakKM: arg?.bakKM || '',
      doorWindow: arg?.doorWindow || '',
      finishingWall: arg?.finishingWall || '',
      floor: arg?.floor || '',
      floorNumber: arg?.floorNumber || '',
      foundation: arg?.foundation || '',
      kusenKM: arg?.kusenKM || '',
      listric: arg?.electricity || '',
      plafon: arg?.plafon || '',
      road: arg?.road || '',
      roadWidth: arg?.roadWidth || '',
      roof: arg?.roof || '',
      sanitize: arg?.sanitize || '',
      securitySystem: arg?.securitySystem || '',
      structure: arg?.structure || '',
      wall: arg?.wall || '',
      wallType: arg?.wallType || '',
      waterSource: arg?.waterSource || '',
    };
    const fasilitas = {
      bedroom: arg?.bedroom || 0,
      carpot: arg?.carpot || 0,
      kitchen: arg?.kitchen || 0,
      livingRoom: arg?.livingRoom || 0,
      toilet: arg?.toilet || 0,
    };

    const dataCreate = {
      homeDesignName: name,
      buildingArea: buildingArea,
      fieldWidth: fieldWidth,
      fieldLength: fieldLength,
      typeUnit: `${buildingArea}/${fieldWidth * fieldLength}`,
      detailsHouse: {
        detailUnit: detailUnit,
        fasilitas: fasilitas,
      },
      pictures: arg?.pictures || [],
      mainPictureUrl: arg?.mainPictureUrl || '',
    };

    const createData = await crmCreate({
      collection: 'cms_home_design',
      data: dataCreate,
    });

    return {
      id: createData?.data?.id,
      name: name,
    };
  }
}
