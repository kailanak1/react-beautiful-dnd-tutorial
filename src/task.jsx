import React, {Component} from 'react';
import styled from 'styled-components';

import {Draggable} from 'react-beautiful-dnd'

const Container = styled.div`
    border: 1px solid lightgrey;
    border-radius: 2px;
    padding 8px; 
    margin-bottom: 8px; 
    background-color: ${props => (props.isDragging ? 'lightgreen' : 'white')}
`

//can add a custom handle to drag stuff, but not always necessary 

// const Handle = styled.div`
//     width: 20px; 
//     height: 20px; 
//     background-color: orange; 
//     border-radius: 4px; 
//     margin-right: 8px;
// `

export default class Task extends React.Component{
    render(){
        return(
            <Draggable 
            draggableId={this.props.task.id} 
            index={this.props.index}
            // disable a drag with the isDragDisabled prop
            // isDragDisabled={this.props.task.id === 'task-1'}
            >
                {(provided, snapshot) => (
                    <Container
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    //use snapshot to create styling
                    isDragging={snapshot.isDragging}
                    >
                        {/* <Handle /> */}
                        {this.props.task.content}
                    </Container>
                )}
            </Draggable>
        )
    }
}