import build_message from './build_message';
import { Task } from '../../interfaces/discord';

const command: Task = {
    name: "manageapp",
    handler: async (client, int, data) => {

        if (!int.isButton()) return;

        const message_data = build_message(data.app, data.created_in);
        
        await int.update(message_data)

    }
}

export default command;