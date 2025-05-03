export const TASK_STATUS = {
  TODO: 'Todo',
  IN_PROGRESS: 'In Progress',
  IN_REVIEW: 'In Review',
  COMPLETED: 'Completed'
};

export const GRID_COLUMNS_LIST = [
  'Todo',
  'In Progress',
  'In Review',
  'Completed'
];

export const GRID_LABEL_EMOJIS = {
  'Todo': '📌',
  'In Progress': '🚧',
  'In Review': '🔎',
  'Completed': '✅'
};

export const GRID_LABELS = [
  {
    label: GRID_COLUMNS_LIST[0],  // 'Todo'
    emoji: GRID_LABEL_EMOJIS['Todo']
  },
  {
    label: GRID_COLUMNS_LIST[1],  // 'In Progress'
    emoji: GRID_LABEL_EMOJIS['In Progress']
  },
  {
    label: GRID_COLUMNS_LIST[2],  // 'In Review'
    emoji: GRID_LABEL_EMOJIS['In Review']
  },
  {
    label: GRID_COLUMNS_LIST[3],  // 'Completed'
    emoji: GRID_LABEL_EMOJIS['Completed']
  }
];

export const ITEM_TYPE = {
  TASK: 'task',
  COLUMN: 'column'
};