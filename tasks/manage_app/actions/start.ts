import { Task } from '../../../interfaces/discord';
import { get_application } from '../../../interfaces/square';
import build_message from '../build_message';

const command: Task = {
    name: "start",
    handler: async (client, int, data) => {

        if (!int.isButton()) return;

        const message_data = build_message(data.app, data.created_in, 'starting');
        
        await int.update(message_data)
        await client.square_api.applications.get(data.app.id).then(app => app.start());
        
        const updated_application = await get_application(data.app.id, client);
        const updated_message_data = build_message(updated_application!, Date.now());

        await int.editReply(updated_message_data)

    }
}

export default command;