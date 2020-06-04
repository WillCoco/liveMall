/**
 * im
 */
import React from 'react';

export default function useIm() {
  
  
  const [_, forceUpdate] = React.useState(0);
  return () => forceUpdate(x => x + 1);
}
