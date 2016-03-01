defmodule Exray.Tracer do
  use GenServer
  alias Exray.EventChannel

  def start do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init(args) do
    :erlang.trace(:all, true, [:procs])
    {:ok, args}
  end

  def handle_info({:trace, pid, :spawn, pid2, _args}, state) do
    EventChannel.push_event("#{inspect pid} spawned #{inspect pid2}")
    {:noreply, state}
  end

  def handle_info(_message, state) do
    {:noreply, state}
  end
end
