import { useEffect, useState, useCallback } from 'react'; 
import Tasks from './Tasks'; 
import { getAccessToken } from "../utils/helpers";
import SortActions from './SortActions';

export default function Column({ column, activeBoardId, setDataFromSearch, checkDataFromSearch}) {   
  const [columnTasks, setColumnTasks] = useState([]);   
  const [allTasks, setAllTasks] = useState([]);   
  const [currentTask, setCurrentTask] = useState(null);   
  const [searchTerm] = useState('');   
  const [sortBy, setSortBy] = useState('created_at'); 
  
  
  useEffect(() => {
    if (checkDataFromSearch === 1) {
      const savedTasks = localStorage.getItem("myTasks");
      if (savedTasks) {
        try {
          const parsedTasks = JSON.parse(savedTasks);
          setAllTasks(parsedTasks);  
        } catch (error) {
          console.error("Помилка парсингу збережених задач:", error);
        }
      }
      setDataFromSearch(0);
    }
  }, [checkDataFromSearch]);


  const fetchTasks = useCallback(async () => {     
    try {       
      if (!activeBoardId) return;              
      
      const token = getAccessToken();       
      const response = await fetch(         
        `http://127.0.0.1:8000/api/api_v1/task/tasks-by-board?board_id=${activeBoardId}`,         
        {           
          method: 'GET',           
          headers: {             
            'accept': 'application/json',             
            'Authorization': `Bearer ${token}`           
          }         
        }       
      );              
      
      if (!response.ok) {         
        throw new Error(`HTTP error! Status: ${response.status}`);       
      }              
      
      const data = await response.json();       
      setAllTasks(data);     
    } catch (error) {       
      console.error("Error fetching tasks:", error);     
    }   
  }, [activeBoardId]);    

  useEffect(() => {     
    fetchTasks();   
  }, [fetchTasks]);    
  
  useEffect(() => {     
    const tasksForColumn = allTasks.filter(task =>        
      task.status === column.label     
    );          
    
    const filtered = tasksForColumn.filter(task =>        
      task.title.toLowerCase().includes(searchTerm.toLowerCase())     
    );          
    
    function sort(a, b) {       
      switch (sortBy) {         
        case 'title':           
          return a.title.localeCompare(b.title);         
        case 'created_at':           
          return new Date(b.created_at) - new Date(a.created_at);         
        default:           
          return new Date(b.created_at) - new Date(a.created_at);       
      }     
    }          
    
    const sorted = [...filtered].sort(sort);     
    setColumnTasks(sorted);   
  }, [allTasks, column.label, searchTerm, sortBy]);    
  

  return (     
    <div className="board-column">       
      <div className="column-header">         
        <div className="column-identifier">{column.label} <span>{column.emoji}</span></div>         
        <span className="column-count">           
          {columnTasks?.length}         
        </span>
        <div className="column-sort">
          <SortActions sortBy={sortBy} setSortBy={setSortBy} />
        </div>
      </div>
      <Tasks         
        tasks={columnTasks}         
        columnName={column.label}         
        setCurrentTask={setCurrentTask}         
        fetchTasks={fetchTasks} // Передаємо функцію для оновлення задач
      />     
    </div>   
  ); 
}