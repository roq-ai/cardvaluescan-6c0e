import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getTradingCardById, updateTradingCardById } from 'apiSdk/trading-cards';
import { Error } from 'components/error';
import { tradingCardValidationSchema } from 'validationSchema/trading-cards';
import { TradingCardInterface } from 'interfaces/trading-card';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function TradingCardEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<TradingCardInterface>(
    () => (id ? `/trading-cards/${id}` : null),
    () => getTradingCardById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: TradingCardInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateTradingCardById(id, values);
      mutate(updated);
      resetForm();
      router.push('/trading-cards');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<TradingCardInterface>({
    initialValues: data,
    validationSchema: tradingCardValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Trading Card
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
              {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="series" mb="4" isInvalid={!!formik.errors?.series}>
              <FormLabel>Series</FormLabel>
              <Input type="text" name="series" value={formik.values?.series} onChange={formik.handleChange} />
              {formik.errors.series && <FormErrorMessage>{formik.errors?.series}</FormErrorMessage>}
            </FormControl>
            <FormControl id="edition" mb="4" isInvalid={!!formik.errors?.edition}>
              <FormLabel>Edition</FormLabel>
              <Input type="text" name="edition" value={formik.values?.edition} onChange={formik.handleChange} />
              {formik.errors.edition && <FormErrorMessage>{formik.errors?.edition}</FormErrorMessage>}
            </FormControl>
            <FormControl id="features" mb="4" isInvalid={!!formik.errors?.features}>
              <FormLabel>Features</FormLabel>
              <Input type="text" name="features" value={formik.values?.features} onChange={formik.handleChange} />
              {formik.errors.features && <FormErrorMessage>{formik.errors?.features}</FormErrorMessage>}
            </FormControl>
            <FormControl id="estimated_value" mb="4" isInvalid={!!formik.errors?.estimated_value}>
              <FormLabel>Estimated Value</FormLabel>
              <NumberInput
                name="estimated_value"
                value={formik.values?.estimated_value}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('estimated_value', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.estimated_value && <FormErrorMessage>{formik.errors?.estimated_value}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'trading_card',
  operation: AccessOperationEnum.UPDATE,
})(TradingCardEditPage);
