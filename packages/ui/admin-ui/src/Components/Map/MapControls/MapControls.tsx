import React, { FunctionComponent } from 'react';
import './MapControls.css';

type MapControlsProps = {
  markersClear: () => void;
  markerCounter: number
}

const MapControls: FunctionComponent<MapControlsProps> = (props) => {
  const { markersClear, markerCounter } = props;
  return <div className="map__controls">
    <button onClick={markersClear} className='map_controls__btn map_controls__btn--clear'>Сбросить маркеры</button>
    <div className="map_controls__info">
      <span className="controls_ino__label">Кол-во маркеров:</span>
      <span className="controls_ino__value">
        { markerCounter }
        { markerCounter >= parseInt(process.env.REACT_APP_MAX_MARKERS!) ?  (
          <span className='small' style={{ marginLeft: '2px' }} >(МАКС)</span>
        ) : null }
      </span>
    </div>
  </div>;
}

export default MapControls;
