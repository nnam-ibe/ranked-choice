'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  FormInput,
  Switch,
  Tag,
} from '../../../components/form-components';
import { choiceMaxLength } from '@ranked-choice-voting/constants';
import { PollFormZodSchema } from '@ranked-choice-voting/types';
import type { PollForm } from '@ranked-choice-voting/types';

import { createPoll } from '../../../lib/client/apiClient';
import styles from './page.module.css';
import utilStyles from '../../../styles/utils.module.css';

/**
TODO: Add Link to poll after creation
 */

export function CreatePage() {
  const [currentItem, setCurrentItem] = useState<string>('');
  const [items, setItems] = useState<Set<string>>(new Set([]));
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const defaultValues: PollForm = {
    choices: [],
    description: '',
    title: '',
    type: true,
  };
  const {
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    trigger,
    register,
  } = useForm({
    resolver: zodResolver(PollFormZodSchema),
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

  async function onSubmitForm(data: PollForm) {
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
      <article className={styles.container}>
        <h2 className="text-2xl font-extrabold">Create a Poll</h2>
        <FormInput
          name="title"
          helperText="Title of the poll"
          id="create-title"
          isRequired={true}
          label="Poll Title"
          placeholder="First day of the week"
          register={register}
          isInvalid={!!errors.title}
          errorMessage={errors.title?.message}
        />
        <FormInput
          name="description"
          helperText="Description/Subtitle for more context"
          id="create-description"
          label="Poll Description"
          placeholder="Does the week start on Monday or Sunday?"
          register={register}
          isInvalid={!!errors.description}
          errorMessage={errors.description?.message}
        />
        <div>
          <FormInput
            id="create-choices"
            name="choices"
            label="Poll Choices"
            helperText="Poll choices to vote on"
            errorMessage={errors?.choices?.message}
            isInvalid={!!errors?.choices}
            placeholder="Monday, Sunday"
            rightAddon={{ title: 'Add Choice', onClick: handleAddChip }}
            value={currentItem}
            onChange={(e) => setCurrentItem(e.target.value)}
          />
          {
            <div className={utilStyles.tagContainer}>
              {Array.from(items).map((item) => (
                <Tag
                  key={item}
                  title={item}
                  onDelete={() => handleRemoveChip(item)}
                />
              ))}
            </div>
          }
        </div>
        <Switch
          id="create-voting-type-switching"
          name="type"
          register={register}
          size="lg"
          label="Ranked Choice Voting"
        />
        <Button id="submit-button" isLoading={submitLoading} type="submit">
          Create Poll
        </Button>
      </article>
    </form>
  );
}

export default CreatePage;
