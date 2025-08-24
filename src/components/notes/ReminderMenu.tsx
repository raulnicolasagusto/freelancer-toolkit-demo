'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Calendar } from 'lucide-react';

interface ReminderMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminderData: {
    date: string;
    time: string;
    location: string;
  }) => void;
  currentReminder?: {
    date: string;
    time: string;
    location: string;
  };
}

export default function ReminderMenu({ isOpen, onClose, onSave, currentReminder }: ReminderMenuProps) {
  const [selectedDate, setSelectedDate] = useState(currentReminder?.date || '');
  const [selectedTime, setSelectedTime] = useState(currentReminder?.time || '');
  const [selectedLocation, setSelectedLocation] = useState(currentReminder?.location || '');

  // Obtener fecha de hoy y mañana
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleTodayLater = () => {
    setSelectedDate(formatDate(today));
    setSelectedTime('18:00'); // 6 PM por defecto
  };

  const handleTomorrow = () => {
    setSelectedDate(formatDate(tomorrow));
    setSelectedTime('09:00'); // 9 AM por defecto
  };

  const handleSaveReminder = () => {
    if (selectedDate && selectedTime) {
      onSave({
        date: selectedDate,
        time: selectedTime,
        location: selectedLocation
      });
      onClose();
    }
  };

  const handleClearReminder = () => {
    setSelectedDate('');
    setSelectedTime('');
    setSelectedLocation('');
    onSave({
      date: '',
      time: '',
      location: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="absolute bottom-20 left-4 bg-white rounded-lg shadow-lg border p-3 z-20 w-72"
      >
        {/* Header */}
        <div className="mb-3">
          <h3 className="font-medium text-gray-800 text-sm mb-1">Recuérdamelo más tarde</h3>
          <p className="text-xs text-gray-500">Se guarda en recordatorios de google</p>
        </div>

        {/* Quick Options */}
        <div className="space-y-1 mb-3">
          <button
            onClick={handleTodayLater}
            className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 rounded transition-colors text-left"
          >
            <Clock className="w-4 h-4 text-orange-500" />
            <div>
              <div className="text-sm font-medium text-gray-800">Hoy más tarde</div>
              <div className="text-xs text-gray-500">18:00</div>
            </div>
          </button>

          <button
            onClick={handleTomorrow}
            className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 rounded transition-colors text-left"
          >
            <Clock className="w-4 h-4 text-blue-500" />
            <div>
              <div className="text-sm font-medium text-gray-800">Mañana</div>
              <div className="text-xs text-gray-500">09:00</div>
            </div>
          </button>
        </div>

        {/* Custom Date/Time */}
        <div className="border-t pt-2 space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 text-gray-500" />
            <span className="text-xs font-medium text-gray-700">Elegir fecha y hora</span>
          </div>
          
          <div className="flex gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Location */}
        <div className="border-t pt-2 mt-2">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-3 h-3 text-gray-500" />
            <span className="text-xs font-medium text-gray-700">Ubicación</span>
          </div>
          <input
            type="text"
            placeholder="Agregar ubicación"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t">
          <button
            onClick={handleClearReminder}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            Quitar
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveReminder}
              disabled={!selectedDate || !selectedTime}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs rounded transition-colors"
            >
              Guardar
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}