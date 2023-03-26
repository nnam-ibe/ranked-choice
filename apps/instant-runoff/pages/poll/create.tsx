import { useState } from 'react';
import {
  Button,
  Chip,
  ChipDelete,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  Stack,
  Typography,
} from '@mui/joy';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  choiceMaxLength,
  APIPollZodSchema,
} from '../../core/schemas/PollSchemas';
import { createPoll } from '../../lib/client/apiClient';
import styles from './create.module.css';
import type { APIPoll } from '../../core/schemas/PollSchemas';

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
    if (currentItem.length > choiceMaxLength) return;
    const itemsToAdd = currentItem.split(',');

    const newItems = new Set(items);
    itemsToAdd.forEach((toAdd) => {
      toAdd = toAdd.trim();
      if (toAdd.length === 0) return;
      if (items.has(toAdd)) return;
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
        <Stack
          alignItems="stretch"
          className={styles['stack']}
          direction="column"
          justifyContent="center"
          spacing={2}
        >
          <Typography level="h1">Create a Poll</Typography>
          <FormControl>
            <FormLabel
              sx={(theme) => ({
                '--FormLabel-color': theme.vars.palette.primary.plainColor,
              })}
            >
              Poll Title
            </FormLabel>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  error={!!errors?.title}
                  onChange={field.onChange}
                  placeholder="First day of the week"
                  value={field.value}
                />
              )}
            />

            <FormHelperText>
              <Typography
                color={errors?.title ? 'danger' : 'neutral'}
                level="body2"
              >
                {errors?.title?.message ?? 'Title of the poll'}
              </Typography>
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel
              sx={(theme) => ({
                '--FormLabel-color': theme.vars.palette.primary.plainColor,
              })}
            >
              Poll Description
            </FormLabel>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input
                  error={!!errors?.description}
                  onChange={field.onChange}
                  placeholder="Does the week start on Monday or Sunday?"
                  value={field.value}
                />
              )}
            />
            <FormHelperText>
              <Typography
                color={errors?.description ? 'danger' : 'neutral'}
                level="body2"
              >
                {errors?.description?.message ??
                  'Description/Subtitle for more context'}
              </Typography>
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel
              sx={(theme) => ({
                '--FormLabel-color': theme.vars.palette.primary.plainColor,
              })}
            >
              Poll Choices
            </FormLabel>
            <Input
              placeholder="Monday"
              sx={{ '--Input-decoratorChildHeight': '38px' }}
              value={currentItem}
              onChange={(e) => setCurrentItem(e.target.value)}
              slotProps={{ input: { maxLength: choiceMaxLength } }}
              error={!!errors?.choices}
              endDecorator={
                <Button
                  color="primary"
                  onClick={handleAddChip}
                  sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  variant="solid"
                >
                  Add Choice
                </Button>
              }
            />
            <FormHelperText>
              <Typography
                color={errors?.choices ? 'danger' : 'neutral'}
                level="body2"
              >
                {errors?.choices?.message ?? 'Poll choices to vote on'}
              </Typography>
            </FormHelperText>
            {
              <Grid
                container
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  gap: 1,
                  marginTop: '1rem',
                }}
              >
                {Array.from(items).map((item) => {
                  return (
                    <Chip
                      variant="soft"
                      key={item}
                      endDecorator={
                        <ChipDelete onDelete={() => handleRemoveChip(item)} />
                      }
                    >
                      {item}
                    </Chip>
                  );
                })}
              </Grid>
            }
          </FormControl>
          <Button
            color="primary"
            loading={submitLoading}
            type="submit"
            variant="solid"
          >
            Create Poll
          </Button>
        </Stack>
      </article>
    </form>
  );
}

export default CreatePage;
