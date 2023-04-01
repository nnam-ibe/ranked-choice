import { useState } from 'react';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  choiceMaxLength,
  APIPollZodSchema,
} from '../../core/schemas/PollSchemas';
import { createPoll } from '../../lib/client/apiClient';
import styles from './create.module.css';
import type { APIPoll } from '../../core/schemas/PollSchemas';
import utilStyles from '../../styles/utils.module.css';

/**
TODO: Add error alert
TODO: Add Link to poll after creation
 */

export function CreatePage() {
  const [currentItem, setCurrentItem] = useState<string>('');
  const [items, setItems] = useState<Set<string>>(new Set([]));
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const defaultValues: APIPoll = {
    choices: [],
    description: '',
    title: '',
    type: 'IRV',
  };
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    trigger,
  } = useForm({
    resolver: zodResolver(APIPollZodSchema),
    defaultValues,
  });

  const handleRemoveChip = (currentItem: string) => {
    const newItems = new Set(items);
    newItems.delete(currentItem);
    setItems(newItems);
    setValue('choices', [...newItems]);
  };

  const handleAddChip = () => {
    if (currentItem.length === 0) return;
    const itemsToAdd = currentItem.split(',');

    const newItems = new Set(items);
    itemsToAdd.forEach((toAdd) => {
      if (toAdd.length > choiceMaxLength) return;
      toAdd = toAdd.trim();
      if (toAdd.length === 0) return;
      if (newItems.has(toAdd)) return;
      newItems.add(toAdd);
    });

    // Update items set
    setItems(newItems);
    // Update form value
    setValue('choices', [...newItems]);
    // Clear input
    setCurrentItem('');
    if (errors.choices) {
      trigger('choices');
    }
  };

  async function onSubmitForm(data: APIPoll) {
    try {
      setSubmitLoading(true);
      await createPoll(data);
      reset();
      setItems(new Set([]));
    } catch (error) {
      // TODO: Add Alert, remove console log
      console.error(error);
    }
    setSubmitLoading(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <article className={styles['container']}>
        <VStack
          alignItems="stretch"
          className={styles['stack']}
          direction="column"
          justifyContent="center"
          spacing={2}
        >
          <Text fontSize="lg">Create a Poll</Text>
          <FormControl isInvalid={!!errors?.title}>
            <FormLabel className="required-field">Poll Title</FormLabel>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  onChange={field.onChange}
                  placeholder="First day of the week"
                  value={field.value}
                />
              )}
            />
            {errors?.title?.message ? (
              <FormErrorMessage>{errors?.title?.message}</FormErrorMessage>
            ) : (
              <FormHelperText>Title of the poll</FormHelperText>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors?.description}>
            <FormLabel>Poll Description</FormLabel>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input
                  onChange={field.onChange}
                  placeholder="Does the week start on Monday or Sunday?"
                  value={field.value}
                />
              )}
            />
            {errors?.description?.message ? (
              <FormErrorMessage>
                {errors?.description?.message}
              </FormErrorMessage>
            ) : (
              <FormHelperText>
                Description/Subtitle for more context
              </FormHelperText>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors?.choices}>
            <FormLabel className="required-field">Poll Choices</FormLabel>
            <InputGroup size="md">
              <Input
                placeholder="Monday"
                value={currentItem}
                onChange={(e) => setCurrentItem(e.target.value)}
                maxLength={choiceMaxLength}
              />
              <InputRightAddon px="0">
                <Button
                  colorScheme={'blue'}
                  onClick={handleAddChip}
                  sx={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                  variant="solid"
                >
                  Add Choice
                </Button>
              </InputRightAddon>
            </InputGroup>
            {errors?.choices?.message ? (
              <FormErrorMessage>{errors?.choices?.message}</FormErrorMessage>
            ) : (
              <FormHelperText>Poll choices to vote on</FormHelperText>
            )}
            {
              <div className={utilStyles.tagContainer}>
                {Array.from(items).map((item) => (
                  <Tag
                    colorScheme="blue"
                    variant="solid"
                    borderRadius="full"
                    size="lg"
                    key={item}
                  >
                    <TagLabel>{item}</TagLabel>
                    <TagCloseButton onClick={() => handleRemoveChip(item)} />
                  </Tag>
                ))}
              </div>
            }
          </FormControl>
          <Button
            colorScheme={'blue'}
            isLoading={submitLoading}
            type="submit"
            variant="solid"
          >
            Create Poll
          </Button>
        </VStack>
      </article>
    </form>
  );
}

export default CreatePage;
