import React, { FunctionComponent } from 'react';
import './MapControls.css';

type MapControlsProps = {
  clearMap: () => void;
  markerCounter: number
  routeCalculate: () => void;
}

const MapControls: FunctionComponent<MapControlsProps> = (props) => {
  const { clearMap, markerCounter, routeCalculate } = props;
  return <div className="map__controls">
    <div className="map_controls__info">
      <span className="controls_ino__label">Кол-во маркеров:</span>
      <span className="controls_ino__value">
        { markerCounter }
        { markerCounter >= parseInt(process.env.REACT_APP_MAX_MARKERS!) ?  (
          <span className='small' style={{ marginLeft: '2px' }} >(МАКС)</span>
        ) : null }
      </span>
    </div>
    <button onClick={clearMap} className='map_controls__btn map_controls__btn--clear'>Очистить</button>
    <button onClick={routeCalculate} className='map_controls__btn map_controls__btn--route_calc'>Рассчитать маршрут</button>
  </div>;
}

export default MapControls;
