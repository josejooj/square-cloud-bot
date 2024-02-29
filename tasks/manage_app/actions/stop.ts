import { Task } from '../../../interfaces/discord';
import { get_application } from '../../../interfaces/square';
import build_message from '../build_message';

const command: Task = {
    name: "stop",
    handler: async (client, int, data) => {

        if (!int.isButton()) return;

        const message_data = build_message(data.app, data.created_in, 'stopping');

        await int.update(message_data)
        await client.square_api.applications.get(data.app.id).then(app => app.stop());

        const updated_application = await get_application(data.app.id, client);
        const updated_message_data = build_message(updated_application!, Date.now());

        await int.editReply(updated_message_data)

        client.interactions.set(int.message.id, { app: updated_application, created_in: Date.now(), author_id: int.user.id });
        
    }
}

export default command;