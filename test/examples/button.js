import React from 'react';

/**
 * Button
 * @param {Object} props React props
 * @returns {JSX} template
 */
export default function Button(props) {
  return <button className="button">{ props.label }</button>;
}