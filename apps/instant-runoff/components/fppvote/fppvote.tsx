import { RadioGroup } from '../radio-group/radio-group';

import type { Poll } from '../../core/schemas/PollSchemas';

export interface FPPVoteProps {
  poll: Poll;
  onChange: (nextValue: string) => void;
  value: string;
}

export function FPPVote(props: FPPVoteProps) {
  const { poll, value, onChange } = props;
  const radioOptions = poll.choices.map(({ title }) => title);
  return (
    <RadioGroup value={value} onChange={onChange} options={radioOptions} />
  );
}

export default FPPVote;
