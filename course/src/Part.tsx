import type { CoursePart } from './types';

const assertNever = (value: never): never => {
  throw new Error(`Unhandled course part: ${JSON.stringify(value)}`);
};

const Part = ({ part }: { part: CoursePart }) => {
  switch (part.kind) {
    case 'basic':
      return (
        <p>
          <b>{part.name} {part.exerciseCount}</b>
          <br />
          <i>{part.description}</i>
        </p>
      );
    case 'group':
      return (
        <p>
          <b>{part.name} {part.exerciseCount}</b>
          <br />
          project exercises {part.groupProjectCount}
        </p>
      );
    case 'background':
      return (
        <p>
          <b>{part.name} {part.exerciseCount}</b>
          <br />
          <i>{part.description}</i>
          <br />
          submit to {part.backgroundMaterial}
        </p>
      );
    case 'requirements':
      return (
        <p>
          <b>{part.name} {part.exerciseCount}</b>
          <br />
          <i>{part.description}</i>
          <br />
          required skils: {part.requirements.join(', ')}
        </p>
      );
    default:
      return assertNever(part);
  }
};

export default Part;
