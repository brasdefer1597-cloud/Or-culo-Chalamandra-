import { StrategicMethod } from '../../lib/types';
import React from 'react';

interface MethodSelectorProps {
  methods: StrategicMethod[];
  selectedMethod: StrategicMethod;
  setSelectedMethod: (method: StrategicMethod | null) => void;
}

export const MethodSelector: React.FC<MethodSelectorProps> = ({ methods, selectedMethod, setSelectedMethod }) => {
  const handleMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMethodName = event.target.value;
    const newSelectedMethod = methods.find(m => m.name === selectedMethodName) || null;
    setSelectedMethod(newSelectedMethod);
  };

  return (
    <div className="w-full max-w-md">
      <label htmlFor="method-selector" className="block text-lg font-medium text-gray-300 mb-2">
        Modelo Estratégico
      </label>
      <select
        id="method-selector"
        value={selectedMethod.name}
        onChange={handleMethodChange}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
      >
        {methods.map((method) => (
          <option key={method.name} value={method.name}>
            {method.name}
          </option>
        ))}
      </select>
    </div>
  );
};
