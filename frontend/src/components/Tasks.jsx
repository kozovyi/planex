import '../styles/task-list.css';
import PropTypes from 'prop-types';
import Task from './Task';
import Modal from './Modal';
import { useState, useCallback } from 'react';
import { Labels } from './Task';
import TaskCardActions from './TaskCardActions';

export default function Tasks({ tasks, columnName, setCurrentTask, fetchTasks }) {
  const [isTaskExpanded, setIsTaskExpanded] = useState(false);
  const [currentTaskDetails, setCurrentTaskDetails] = useState(null);

  const refreshTasks = useCallback(() => {
    if (fetchTasks) {
      fetchTasks();
    }
  }, [fetchTasks]);

  // console.log(tasks)
  if (!Array.isArray(tasks)) {
    return '';
  }
  
  const handleTaskSelect = (task) => {
    setCurrentTaskDetails(task);
    setCurrentTask(task);
    setIsTaskExpanded(true);
  };

  return (
    <ul className='task-list'>
      {
        tasks?.map((task, i) => {
          return (
            <li key={task.id || i}>
              <Modal
                maxHeight='425px'
                styles={{ gridRow: '1 / 18', padding: '1rem 0' }}
                hideHeader={true}
                content={<DisplayTask task={currentTaskDetails} />}
                footer={<TaskCardActions 
                  task={currentTaskDetails}
                  onClose={() => setIsTaskExpanded(false)}
                  refreshTasks={refreshTasks}
                />}
                isOpen={isTaskExpanded}
                onClose={() => {
                  setIsTaskExpanded(false);
                }}
              />
              <Task
                task={task}
                onSelect={handleTaskSelect}
              />
            </li>
          );
        })
      }
    </ul>
  )
}

function DisplayTask({ task }) {
  if (!task) return '';
  return (
    <div
      className="display-task"
      style={{
        padding: '0 2rem',
        fontSize: '1rem',
      }}
    >
      <h3
        style={{
          fontSize: '2rem',
          margin: '1rem 0',
          lineHeight: 'normal'
        }}
      >
        {task.title}
      </h3>
      <div style={{ fontSize: '1rem', display: 'flex', flexDirection: 'column' }}>
        <span>Status: {task.status}</span>
        <span>Created: {new Date(task.created_at).toLocaleString()}</span>
      </div>
      <p className="task__desc" style={{ margin: '1.5rem 0' }}>
        {task.description}
      </p>
      <Labels labels={task.tags} />
    </div>
  );
}

Tasks.propTypes = {
  tasks: PropTypes.array,
  columnName: PropTypes.string,
  setCurrentTask: PropTypes.func,
  fetchTasks: PropTypes.func
};

DisplayTask.propTypes = {
  task: PropTypes.object,
};