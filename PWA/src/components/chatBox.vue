<template>
  <div v-if="isOpen" class="chat-modal-backdrop" @click.self="close">
    <div class="chat-modal">
      <div class="chat-header">
        <div class="chat-title">
          Chat entre <strong>{{ peritoName }}</strong> e <strong>{{ userName }}</strong>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>
      <div class="chat-messages">
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          :class="['chat-bubble', msg.from === 'perito' ? 'bubble-perito' : 'bubble-user']"
        >
          <div class="message-text">{{ msg.text }}</div>
          <div class="message-time">{{ formatTime(msg.time) }}</div>
        </div>
      </div>
      <div class="chat-input">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage('perito')"
          placeholder="Digite uma mensagem..."
        />
        <button @click="sendMessage('perito')">Enviar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatBox',
  props: {
    userName: { type: String, required: true },
    peritoName: { type: String, required: true },
    isOpen:   { type: Boolean, required: true }
  },
  data() {
    return {
      messages: [],
      newMessage: ''
    }
  },
  watch: {
    isOpen(val) {
      if (val) this.loadMessages();
    }
  },
  methods: {
    loadMessages() {
      const key = `chat_${this.userName}`;
      this.messages = JSON.parse(localStorage.getItem(key)) || [];
    },
    saveMessages() {
      const key = `chat_${this.userName}`;
      localStorage.setItem(key, JSON.stringify(this.messages));
    },
    sendMessage(from) {
      const text = this.newMessage.trim();
      if (!text) return;
      const time = new Date().toISOString();
      this.messages.push({ from, text, time });
      this.saveMessages();
      this.newMessage = '';
    },
    formatTime(timestr) {
      const date = new Date(timestr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    close() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.chat-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.chat-modal {
  background: #fff;
  width: 100%;
  max-width: 400px;
  height: 80%;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}
.chat-header {
  background: #023b1c;
  color: white;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chat-title {
  font-size: 1rem;
}
.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
}
.chat-messages {
  flex: 1;
  padding: 0.5rem;
  overflow-y: auto;
  background: #f9f9f9;
  display: flex;
  flex-direction: column;
}
.chat-bubble {
  max-width: 80%;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  position: relative;
}
.bubble-perito {
  background: #e8f5e9;
  align-self: flex-end;
}
.bubble-user {
  background: #e3f2fd;
  align-self: flex-start;
}
.message-text {
  font-size: 0.9rem;
}
.message-time {
  font-size: 0.7rem;
  color: #666;
  position: absolute;
  bottom: -1.2rem;
  right: 0.5rem;
}
.chat-input {
  display: flex;
  border-top: 1px solid #ddd;
  padding: 0.5rem;
}
.chat-input input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  margin-right: 0.5rem;
}
.chat-input button {
  padding: 0 1rem;
  background: #023b1c;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 480px) {
  .chat-modal {
    height: 50%;
    max-width: 90%;
    border-radius: 0;
  }
  .chat-header {
    padding: 0.5rem;
  }
  .chat-input input {
    padding: 0.4rem;
  }
  .chat-input button {
    padding: 0 0.8rem;
  }
}
</style>
