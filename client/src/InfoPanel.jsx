import React from 'react';

const hotel = {
  name: 'Grand Codex Hotel',
  amenities: ['Free WiFi', 'Pool', 'Spa', 'Gym'],
  contact: 'Dial 0 from your room phone for reception',
  description:
    'Welcome to the Grand Codex Hotel. Enjoy our comfortable rooms and quality services during your stay.'
};

export default function InfoPanel() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">{hotel.name}</h1>
      <p>{hotel.description}</p>
      <div>
        <h2 className="text-xl mb-1">Amenities</h2>
        <ul className="list-disc list-inside">
          {hotel.amenities.map(a => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
      <p className="font-semibold">{hotel.contact}</p>
    </div>
  );
}
