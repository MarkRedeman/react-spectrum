import {GridCollection, useGridState} from '@react-stately/grid';
import {mergeProps} from '@react-aria/utils';
import React from 'react';
import {useFocus} from '@react-aria/interactions';
import {useGrid, useGridCell, useGridRow} from '../';
import {useListState} from '@react-stately/list';

export function Grid(props) {
  let {gridFocusMode = 'row', cellFocusMode = 'child', selectionMode = 'multiple'} = props;
  let state = useListState(props);
  let gridState = useGridState({
    ...props,
    selectionMode,
    collection: new GridCollection({
      columnCount: 1,
      items: [...state.collection].map(item => ({
        type: 'item',
        childNodes: [{
          ...item,
          index: 0,
          type: 'cell'
        }]
      }))
    })
  });

  let ref = React.useRef();
  let {gridProps} = useGrid({
    ref,
    'aria-label': 'Grid',
    focusMode: gridFocusMode
  }, gridState);

  return (
    <div {...gridProps} ref={ref}>
      {[...gridState.collection].map(item =>
        (<Row
          key={item.key}
          state={gridState}
          item={item}
          focusMode={cellFocusMode} />)
      )}
    </div>
  );
}

function Row({state, item, focusMode}) {
  let rowRef = React.useRef();
  let cellRef = React.useRef();
  let cellNode = [...item.childNodes][0];
  let {rowProps, isPressed} = useGridRow({
    node: item,
    ref: rowRef
  }, state);
  let {gridCellProps} = useGridCell({
    node: cellNode,
    ref: cellRef,
    focusMode
  }, state);

  let [isRowFocused, setRowFocused] = React.useState(false);
  let {focusProps: rowFocusProps} = useFocus({
    onFocusChange: setRowFocused
  });

  let [isCellFocused, setCellFocused] = React.useState(false);
  let {focusProps: cellFocusProps} = useFocus({
    onFocusChange: setCellFocused
  });

  return (
    <div {...mergeProps(rowProps, rowFocusProps)} ref={rowRef} style={{outline: isRowFocused ? '2px solid red' : null}} data-testid={isPressed ? 'pressed' : 'notpressed'}>
      <div {...mergeProps(gridCellProps, cellFocusProps)} ref={cellRef} style={{outline: isCellFocused ? '2px solid green' : null}}>
        {cellNode.rendered}
      </div>
    </div>
  );
}
