import React, { useState } from "react";
import {
  Button,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as crypto from "expo-crypto";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Tipos
type UUID = string;

type TodoItem = {
  id: UUID;
  value: string;
  done: boolean;
};

type FilterOption = "all" | "done" | "pending";

// Componente de item da lista
function ListItem({
  todo,
  onToggle,
}: {
  todo: TodoItem;
  onToggle: (id: UUID) => void;
}) {
  const handlePress = () => {
    console.log(`Todo item with id ${todo.id} toggled.`);
    onToggle(todo.id);
  };

  return (
    <View style={styles.todoItemContainer}>
      {todo.done ? (
        <Text style={styles.todoTextDone}>{todo.value}</Text>
      ) : (
        <>
          <Text style={styles.todoText}>{todo.value}</Text>
          <Button title="Concluir" onPress={handlePress} color="green" />
        </>
      )}
    </View>
  );
}

// Formulário para adicionar item
function AddTodoForm({ onAdd }: { onAdd: (text: string) => void }) {
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (!text.trim()) return;

    onAdd(text);
    setText("");
    Keyboard.dismiss();
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        value={text}
        onChangeText={setText}
        style={styles.textInput}
        placeholder="O que você precisa fazer?"
        placeholderTextColor="#666"
        onSubmitEditing={handleAdd}
        returnKeyType="done"
      />
    </View>
  );
}

// Filtro
function TodoFilter({
  onFilter,
  options,
}: {
  onFilter: (option: FilterOption) => void;
  options: Record<string, FilterOption>;
}) {
  return (
    <View style={styles.filterContainer}>
      <Button
        title="Todos"
        onPress={() => onFilter(options.ALL)}
        color="#333"
      />
      <Button
        title="Concluídos"
        onPress={() => onFilter(options.DONE)}
        color="green"
      />
      <Button
        title="Pendentes"
        onPress={() => onFilter(options.PENDING)}
        color="orange"
      />
    </View>
  );
}

// Tela principal
export default function Index() {
  const FILTER_OPTIONS: Record<string, FilterOption> = {
    ALL: "all",
    DONE: "done",
    PENDING: "pending",
  };

  const [todos, setTodos] = useState<TodoItem[]>([
    { id: crypto.randomUUID(), value: "Sample Todo 1", done: false },
    { id: crypto.randomUUID(), value: "Sample Todo 2", done: true },
    { id: crypto.randomUUID(), value: "Sample Todo 3", done: false },
  ]);

  const [filter, setFilter] = useState<FilterOption>(FILTER_OPTIONS.ALL);

  const addTodo = (text: string) => {
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), value: text, done: false },
    ]);
  };

  const toggleTodo = (id: UUID) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const filterTodo = (option: FilterOption) => setFilter(option);

  const filteredTodos = todos.filter((todo) => {
    if (filter === FILTER_OPTIONS.DONE) return todo.done;
    if (filter === FILTER_OPTIONS.PENDING) return !todo.done;
    return true;
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <GestureHandlerRootView style={styles.container}>
          <Text style={styles.title}>TODO List</Text>

          <TodoFilter onFilter={filterTodo} options={FILTER_OPTIONS} />

          <AddTodoForm onAdd={addTodo} />

          <FlatList
            style={styles.list}
            data={filteredTodos.sort((a, b) =>
              a.done === b.done ? 0 : a.done ? 1 : -1
            )}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ListItem todo={item} onToggle={toggleTodo} />
            )}
          />
        </GestureHandlerRootView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// Estilos
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#222",
  },
  formContainer: {
    width: "100%",
    marginTop: 10,
  },
  textInput: {
    width: "100%",
    borderColor: "#aaa",
    borderWidth: 1,
    marginVertical: 10,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  todoItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  todoText: {
    fontSize: 18,
    color: "#000",
  },
  todoTextDone: {
    fontSize: 18,
    color: "#777",
    textDecorationLine: "line-through",
  },
  list: {
    width: "100%",
    marginTop: 20,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 15,
  },
});
