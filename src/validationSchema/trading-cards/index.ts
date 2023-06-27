import * as yup from 'yup';

export const tradingCardValidationSchema = yup.object().shape({
  name: yup.string().required(),
  series: yup.string().required(),
  edition: yup.string().required(),
  features: yup.string(),
  estimated_value: yup.number().integer(),
  user_id: yup.string().nullable(),
});
