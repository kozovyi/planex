import { useDrag } from 'react-dnd';
import { ITEM_TYPE } from '../utils/constants';
import { isValidArray } from '../utils/helpers';
import '../styles/task.css';

export default function Task({ task, onSelect, children }) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ITEM_TYPE.TASK,
    item: { task },
    collect: (monitor) => ({
      isDragging: Boolean(monitor.isDragging()),
    }),
  }), [task]);

  if (!task) {
    return '';
  }

  // Adapt to API response structure
  const { title, description: desc, tags } = task;
  const labels = typeof tags === 'string' ? tags.trim().split(/\s+/) : [];

  return (
    <div
      ref={dragRef}
      className='task'
      tabIndex={0}
      style={{
        cursor: isDragging && 'move',
        visibility: isDragging && 'hidden',
      }}
      onKeyUp={(e) => {
        if (e.key === 'Enter') {
          onSelect(task);
        }
      }}
      onClick={() => {
        onSelect(task);
      }}
      onDragStart={() => {
        onSelect(task);
      }}
    >
      <Title title={title} controls={children} />
      <Description desc={desc} />
      <Labels labels={labels} />
    </div>
  );
}

function Title({ title, controls }) {
  return (
    <div className="task__header">
      <span className="task__title">
        {title}
      </span>
      {controls}
    </div>
  );
}

function Description({ desc }) {
  if (!desc) return '';
  let truncated = '';
  if (desc.length > 80) {
    truncated = desc.slice(0, 80) + '...';
  }
  return (
    <p className="task__desc">
      {truncated || desc}
    </p>
  );
}

export function Labels({ labels }) {
  if (!isValidArray(labels)) return '';
  return (
    <ul className="task__labels">
      {labels?.map((label, i) => {
        return (
          <li key={i}>{label}</li>
        )
      })}
    </ul>
  )
}