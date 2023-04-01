import { Box, useRadio, useRadioGroup, VStack } from '@chakra-ui/react';
import type { UseRadioProps } from '@chakra-ui/react';

import styles from './radio-group.module.css';

type RadioGroupProps = {
  options: string[];
  onChange: (nextValue: string) => void;
  value: string;
};
export function RadioGroup(props: RadioGroupProps) {
  const { options, onChange, value } = props;

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework',
    onChange,
    value,
  });
  const group = getRootProps();

  return (
    <VStack {...group} className={styles.container}>
      {options.map((value) => {
        const radio = getRadioProps({ value });
        return (
          <RadioCard key={value} {...radio}>
            {value}
          </RadioCard>
        );
      })}
    </VStack>
  );
}

type RadioCardProps = UseRadioProps & { children: React.ReactNode };

function RadioCard(props: RadioCardProps) {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label" className={styles['radio-card-box']}>
      <input {...input} />
      <Box
        className={styles['radio-card-box']}
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
}

export default RadioGroup;
