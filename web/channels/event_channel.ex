defmodule Exray.EventChannel do
  use Phoenix.Channel

  def join("events", _message, socket) do
    {:ok, socket}
  end

  def handle_in("new_msg", message, socket) do
    broadcast! socket, "reply", "Got #{message}"
    {:noreply, socket}
  end

  def push_event(event_type) do
    Exray.Endpoint.broadcast! "events", "new_event", %{type: event_type}
  end
end
