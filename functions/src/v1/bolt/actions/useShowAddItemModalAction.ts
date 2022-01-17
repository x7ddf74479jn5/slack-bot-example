import { App, BlockButtonAction } from "@slack/bolt";
import { addItemModalBlock } from "../blocks/addItemModalBlock";

export const useShowAddItemModalAction = (app: App) => {
  app.action<BlockButtonAction>(
    "show_add_item_modal",
    async ({ ack, client, body, action, logger }) => {
      await ack();
      // modalを表示
      try {
        // 結果をスレッドで返したいためスレッドの情報を取得する
        const conversations = await client.conversations.replies({
          channel: body.channel!.id,
          ts: body.message!.ts,
        });

        // モーダルの表示
        await client.views.open({
          trigger_id: body.trigger_id,
          view: {
            type: "modal",
            // callback_id が view を特定するための識別子
            callback_id: "add_item_view",
            title: {
              type: "plain_text",
              text: "辞書に追加",
            },
            blocks: addItemModalBlock(),
            private_metadata: JSON.stringify({
              channelId: body.channel!.id,
              threadTs: conversations.messages![0].thread_ts,
            }),
            submit: {
              type: "plain_text",
              text: "送信",
            },
          },
        });
      } catch (e) {
        logger.error(e);
      }
    }
  );
};
