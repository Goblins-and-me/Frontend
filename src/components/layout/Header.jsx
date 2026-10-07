'use client'; // Обязательно для Next.js (App Router), так как используем хуки и браузерный API

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react'; // Или ваш импорт иконки

// Обертка в Promise остается прежней
function getCoordinates() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('Геолокация не поддерживается'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export default function Header() {
  // Начальное состояние — дефолтный город (например, Гомель)
  const [city, setCity] = useState('Гомель');

  useEffect(() => {
    async function updateLocation() {
      try {
        const position = await getCoordinates();
        const { latitude, longitude } = position.coords;

        // Здесь обычно вызывают API (например, Яндекс.Карты или OpenStreetMap),
        // чтобы превратить координаты [latitude, longitude] в название города.
        // const cityName = await fetchCityName(latitude, longitude);
        // setCity(cityName);
        
        console.log('Координаты получены:', latitude, longitude);
      } catch (error) {
        console.log('Пользователь отклонил запрос или геолокация недоступна:', error.message);
        // В случае ошибки (или отказа) город останется дефолтным
      }
    }

    updateLocation();
  }, []); // Пустой массив означает, что запрос отработает ОДИН раз при загрузке страницы

  return (
    <div className="mx-auto flex max-w-md items-center justify-between">
      {/* Левая часть: Круглый индикатор и Название */}
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 rounded-full bg-accent" />
        <h1 className="text-xl font-bold text-main">Sweet Story</h1>
      </div>

      {/* Правая часть: Локация (Город) */}
      <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm">
        <MapPin className="h-4 w-4 text-accent" />
        <span className="text-sm font-medium text-second">{city}</span>
      </div>
    </div>
  );
}
