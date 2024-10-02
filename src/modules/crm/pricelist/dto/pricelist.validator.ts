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
