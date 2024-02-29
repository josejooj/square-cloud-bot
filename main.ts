import { config } from 'dotenv';
import { CustomClient } from './CustomClient';

config();

new CustomClient({ intents: ["Guilds"] });