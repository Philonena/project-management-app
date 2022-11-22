import { FC, useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';

import { Modal } from '../UI/Modal/Modal';
import { Task } from '../../components';

import { Droppable } from 'react-beautiful-dnd';
import { Button, Stack } from '@mui/material';

import { GetColumnType } from '../../types/types';
import { DroppableProvided } from '../../pages/Board/react-beautiful-dnd';

import { tasksAPI } from '../../api/tasksApi';

import './TaskList.scss';
import { TaskType } from '../../types/types';

interface TaskProps {
  boardId: string;
  columnId: string;
  columnNum: number;
  column: GetColumnType;
  listType: string;
}

export const TaskList: FC<TaskProps> = ({ boardId, columnId, column, columnNum, listType }) => {
  const [isVisible, setVisible] = useState<boolean>(false);
  const [addTask] = tasksAPI.useCreateTaskMutation();
  const [order, setOrder] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    setOrder(column.items.length > 0 ? Math.max(...column.items.map((o) => o.order)) + 1 : 0);
  }, [column.items]);
  const onSubmit = (value: FieldValues) => {
    addTask({
      boardId: boardId,
      columnId: columnId,
      body: {
        title: value.title,
        order: order,
        description: '_',
        userId: 1,
        users: [],
      },
    })
      .then(() => {
        setVisible(false);
        reset();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Stack>
      {error && <span>error</span>}
      {isLoading && <LinearProgress />}
      <Droppable droppableId={columnId} type="TASKS" isCombineEnabled>
        {(provided: DroppableProvided) => (
          <div className="task_list" {...provided.droppableProps} ref={provided.innerRef}>
            {tasks &&
              tasks.map((t, index) => {
                return (
                  <Task
                    task={t}
                    key={index}
                    columnId={columnId}
                    provided={provided}
                    innerRef={provided.innerRef}
                  />
                );
              })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Button onClick={() => setVisible(true)} variant="outlined" color="success">
        +Add task
      </Button>
      <Modal visible={isVisible} setModal={setVisible}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Title Column"
            {...register('title', { required: true })}
            aria-invalid={errors.title ? 'true' : 'false'}
          />
          {errors.title && <p role="alert">Please, input title</p>}
          <Button type="submit">Создать</Button>
          <Button onClick={() => setVisible(false)}>Отменить</Button>
        </form>
      </Modal>
    </Stack>
  );
};
