import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { fetchNews, Article } from "../../services/gnews";
import { Card, Title, Paragraph } from "react-native-paper";

export default function HomeScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filtered, setFiltered] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");
  const [titleFilter, setTitleFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [limit, setLimit] = useState("10");

  useEffect(() => {
    loadNews();
  }, []);

  useEffect(() => {
    applyLocalFilters(articles, titleFilter, authorFilter);
  }, [articles, titleFilter, authorFilter]);

  async function loadNews() {
    setLoading(true);
    setError("");

    const n = parseInt(limit, 10);
    if (isNaN(n) || n < 1 || n > 100) {
      setError("Please enter a valid number of articles (1–100).");
      setLoading(false);
      return;
    }

    const news = await fetchNews(n, keyword);

    if (news.length === 0 && keyword.trim()) {
      setError("No articles found. Try a different keyword.");
    }

    setArticles(news);
    setLoading(false);
  }

  function applyLocalFilters(
    source: Article[],
    title: string,
    author: string
  ) {
    let result = source;

    if (title.trim()) {
      result = result.filter((a) =>
        a.title.toLowerCase().includes(title.trim().toLowerCase())
      );
    }

    if (author.trim()) {
      result = result.filter((a) =>
        (a.author ?? "").toLowerCase().includes(author.trim().toLowerCase())
      );
    }

    setFiltered(result);
  }

  function clearAll() {
    setKeyword("");
    setTitleFilter("");
    setAuthorFilter("");
    setLimit("10");
    setError("");
  }

  const displayData = titleFilter || authorFilter ? filtered : articles;

  return (
    <View style={styles.container}>
      <Text style={styles.notice}>⚠️ Free plan limit: max 10 articles per request</Text>
      <Text style={styles.sectionLabel}>Search Articles</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Keyword (optional)"
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={loadNews}
          returnKeyType="search"
        />
        <TextInput
          style={[styles.input, styles.limitInput]}
          placeholder="N"
          value={limit}
          onChangeText={setLimit}
          keyboardType="numeric"
          maxLength={3}
        />
        <TouchableOpacity style={styles.button} onPress={loadNews}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionLabel}>Filter Results</Text>
      <TextInput
        style={styles.input}
        placeholder="Filter by title..."
        value={titleFilter}
        onChangeText={setTitleFilter}
      />
      <TextInput
        style={styles.input}
        placeholder="Filter by author..."
        value={authorFilter}
        onChangeText={setAuthorFilter}
      />

      <TouchableOpacity onPress={clearAll}>
        <Text style={styles.clearText}>Clear all</Text>
      </TouchableOpacity>

      {!loading && (
        <Text style={styles.countText}>
          Showing {displayData.length} article
          {displayData.length !== 1 ? "s" : ""}
          {titleFilter || authorFilter ? " (filtered)" : ""}
        </Text>
      )}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" color="#0077cc" style={{ marginTop: 30 }} />
      ) : displayData.length === 0 ? (
        <Text style={styles.emptyText}>No articles to display.</Text>
      ) : (
        <FlatList
          data={displayData}
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              {item.image ? (
                <Card.Cover source={{ uri: item.image }} />
              ) : null}
              <Card.Content>
                <Title>{item.title}</Title>
                <Paragraph>{item.description}</Paragraph>
                <Text style={styles.meta}>
                  ✍️ {item.author || "Unknown author"}
                </Text>
                <Text style={styles.meta}>
                  📰 {item.source.name} ·{" "}
                  {new Date(item.publishedAt).toLocaleDateString()}
                </Text>
              </Card.Content>
            </Card>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f5f5f5",
  },
  sectionLabel: {
    fontWeight: "700",
    fontSize: 13,
    color: "#555",
    marginBottom: 4,
    marginTop: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  input: {
    height: 44,
    width: "50%",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    marginBottom: 6,
    borderRadius: 8,
    fontSize: 14,
  },
  limitInput: {
    width: 50,
    textAlign: "center",
    flex: 0,
  },
  button: {
    backgroundColor: "#0077cc",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  clearText: {
    color: "#0077cc",
    fontSize: 13,
    marginBottom: 6,
    textDecorationLine: "underline",
  },
  countText: {
    fontSize: 12,
    color: "#888",
    marginBottom: 6,
  },
  errorText: {
    color: "#cc0000",
    marginBottom: 8,
    fontSize: 13,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
    fontSize: 15,
  },
  card: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  meta: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
  notice: {
    fontSize: 30,
    color: "#e67e00",
    marginBottom: 6,
    fontStyle: "italic",
  },
});