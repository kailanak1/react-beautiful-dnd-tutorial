import React from 'react';
import ReactDOM from 'react-dom';

import '@atlaskit/css-reset';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import styled from 'styled-components';

import initialData from './initial-data';
import Column from './column';


const Container = styled.div`
  display: flex;
  `

class App extends React.Component {
  state = initialData;

  // onDragStart = () => {
  //   //change the color when drag starts 
  //   document.body.style.color = 'orange'
  //   document.body.style.transition = 'background-color 0.2s ease'

  //so that you cannot move backwards between the columns
  // const homeIndex = this.state.columnOrder.indexOf(start.source.droppableId)
  // this.setState({
  //   homeIndex, 
  //   })
  // }

  // onDragUpdate = update =>{
  //   const { destination} = update; 
  //   const opacity = destination ? destination.index / Object.keys(this.state.tasks).length: 0
  //   document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity}))`
  // }

  onDragEnd = result => {
    // this.setState({
    //   homeIndex: null,
    // })
    //reset color when drag completes 
    // document.body.style.color='inherit'
    // document.body.style.backgroundColor = 'inheret'
    const { destination, source, draggableId, type } = result;
    if(! destination){ 
      return; 
    }
    if(
      destination.droppableId === source.droppableId && destination.index === source.index
    ){
      return 
    }
    //for reording columns and tasks, must break up the logic
    if(type === 'column'){
      const newColumnOrder=Array.from(this.state.columnOrder)
      newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, draggableId)

      const newState = {
        ...this.state, 
        columnOrder: newColumnOrder,
      }
      this.setState(newState)
      return;
    }
    //to move between columns, need to use something other than droppable ids
    const start = this.state.columns[source.droppableId]; 
    const finish = this.state.columns[destination.droppableId]
    if(start === finish){
      //create new object for the things that were changed
    const newTaskIds = Array.from(start.taskIds);
    //change taskId from old indext to new index.
    //from index, remove one item
    newTaskIds.splice(source.index, 1)
    newTaskIds.splice(destination.index, 0, draggableId)
    //create new column with same properties, with new targets array
    const newColumn = {
      ...start, 
      taskIds: newTaskIds, 

    }

    const newState = {
      ...this.state, 
      columns: {
        ...this.state.columns, 
        [newColumn.id]: newColumn,
      },
    }

    this.setState(newState)
    return;
    }

    //Moving from one list to another 
    const startTaskIds = Array.from(start.taskIds)
    startTaskIds.splice(source.index, 1)
    const newStart = {
      ...start, 
      taskIds: startTaskIds, 
    }
    const finishTaskIds = Array.from(finish.taskIds); 
    finishTaskIds.splice(destination.index, 0, draggableId)
    const newFinish = {
      ...finish, 
      taskIds: finishTaskIds,
    }

    const newState = {
      ...this.state, 
      columns: {
        ...this.state.columns, 
        [newStart.id]: newStart, 
        [newFinish.id]: newFinish, 
      },
    }
    this.setState(newState)
  }

  



  render(){
    return(
      <DragDropContext 
      onDragEnd={this.onDragEnd}
      onDragStart={this.onDragStart}
      // onDragUpdate={this.onDragUpdate}
      >
        
        <Droppable droppableId="all-column" direction="horizontal" type="column">
          {(provided) => (
          <Container
          {...provided.droppableProps}
          ref={provided.innerRef}
          >
            {this.state.columnOrder.map((columnId, index) => {
              const column = this.state.columns[columnId];
              const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);
              //prevents dragging backwards between the columns 
              // const isDropDisabled = index < this.state.homeIndex;
              //pass as a prop to Column isDropDisabled={isDropDisabled}
              return <Column key={column.id} column={column} tasks={tasks} index={index}/>
            })
            }
            {provided.placeholder}
         </Container>
         )}
        </Droppable>
      </DragDropContext>
    ) 
  }
}



ReactDOM.render(<App />, document.getElementById('root'));