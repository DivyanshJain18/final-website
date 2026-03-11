export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: '4WD Robot Chassis Kit',
    slug: '4wd-robot-chassis',
    description: 'Aluminum alloy 4WD robot chassis with DC motors.',
    price: 45.99,
    stock: 50,
    category_id: 1,
    image_url: 'https://picsum.photos/seed/robot1/400/400',
    category_name: 'Robotics'
  },
  {
    id: 2,
    name: 'Servo Motor MG996R',
    slug: 'servo-mg996r',
    description: 'High torque metal gear digital servo.',
    price: 12.50,
    stock: 100,
    category_id: 1,
    image_url: 'https://picsum.photos/seed/servo1/400/400',
    category_name: 'Robotics'
  },
  {
    id: 3,
    name: 'Arduino Uno R3 Clone',
    slug: 'arduino-uno-r3',
    description: 'ATmega328P based microcontroller board.',
    price: 15.00,
    stock: 200,
    category_id: 2,
    image_url: 'https://picsum.photos/seed/arduino/400/400',
    category_name: 'Microcontrollers'
  },
  {
    id: 4,
    name: 'ESP32 Dev Module',
    slug: 'esp32-dev',
    description: 'WiFi + Bluetooth dual-mode development board.',
    price: 8.99,
    stock: 150,
    category_id: 2,
    image_url: 'https://picsum.photos/seed/esp32/400/400',
    category_name: 'Microcontrollers'
  },
  {
    id: 5,
    name: 'HC-SR04 Ultrasonic Sensor',
    slug: 'hc-sr04',
    description: 'Ultrasonic distance measuring module.',
    price: 2.50,
    stock: 300,
    category_id: 3,
    image_url: 'https://picsum.photos/seed/sensor1/400/400',
    category_name: 'Sensors'
  },
  {
    id: 6,
    name: 'RTX 4060 Ti',
    slug: 'rtx-4060-ti',
    description: '8GB GDDR6 Graphics Card.',
    price: 399.99,
    stock: 10,
    category_id: 4,
    image_url: 'https://picsum.photos/seed/gpu/400/400',
    category_name: 'PC Components'
  }
];

export const MOCK_CATEGORIES = [
  { id: 1, name: 'Robotics', slug: 'robotics', description: 'Robot kits, servos, and chassis' },
  { id: 2, name: 'Microcontrollers', slug: 'microcontrollers', description: 'Arduino, ESP32, Raspberry Pi' },
  { id: 3, name: 'Sensors', slug: 'sensors', description: 'Temperature, distance, and motion sensors' },
  { id: 4, name: 'PC Components', slug: 'pc-components', description: 'GPUs, CPUs, RAM, and Motherboards' },
  { id: 5, name: 'Tools', slug: 'tools', description: 'Soldering irons, multimeters, and screwdrivers' }
];

export const MOCK_ADMIN_USER = {
  id: 1,
  name: 'Admin User',
  email: 'admin@mechafy.com',
  role: 'admin'
};
