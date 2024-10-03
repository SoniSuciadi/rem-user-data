import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function HasAtLeastOneSellTrue(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'hasAtLeastOneSellTrue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any[], args: ValidationArguments) {
          if (!Array.isArray(value)) return false;
          // Mengecek apakah ada setidaknya satu objek dengan sell: true
          return value.some((item) => item.sell === true);
        },
        defaultMessage(args: ValidationArguments) {
          return 'At least one object in listHarga must have sell as true.';
        },
      },
    });
  };
}

export function IsSellValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isSellValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Jika sell bernilai true, price harus lebih besar dari 0
          const sell = (args.object as any).sell;
          if (sell === true) {
            return value > 0;
          }
          return true; // Jika sell tidak true, tidak ada validasi untuk price
        },
        defaultMessage(args: ValidationArguments) {
          return 'If sell is true, price must be greater than 0';
        },
      },
    });
  };
}
