import { dbPocketbase } from 'src/common/helpers/crm.helper';
import { CreateHomeDesignDto } from './dto/homeDesign.dto';

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
    const detailUnit = {
      bakKM: '',
      doorWindow: 'Kusen Aluminium',
      finishingWall: 'Cat Dinding',
      floor: '40cm x 40cm',
      floorNumber: '1',
      foundation: 'Batu Kali Menerus',
      kusenKM: 'PVC',
      listric: '2200',
      plafon: 'Gypsum',
      road: 'Paving',
      roadWidth: '6.5',
      roof: 'Rangka Atap Galvalum',
      sanitize: 'Closet duduk',
      securitySystem: 'CCTV 24 jam',
      structure: 'Beton Bertulang',
      wall: 'Bata Ringan',
      wallType: 'Hebel',
      waterSource: 'Sumur Bor / PAM',
    };

    const fasilitas = {
      bedroom: 2,
      carpot: 1,
      kitchen: 1,
      livingRoom: 1,
      toilet: 1,
    };
  }
}
