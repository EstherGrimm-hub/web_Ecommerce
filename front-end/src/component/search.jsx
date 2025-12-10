import { useState, useCallback } from "react";
import { AutoComplete, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { elasticSearchApi } from "../unti/elasticSearch";

// Debounce
function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

export default function HeaderSearch({ onSelectResult }) {
  const [options, setOptions] = useState([]);

  const fetchSearch = async (value) => {
    if (!value.trim()) {
      setOptions([]);
      return;
    }

    try {
      const res = await elasticSearchApi(value);
      const data = res.data || res || [];

      setOptions([
        {
          label: <b>🔍 Gợi ý cho "{value}"</b>,
          options: data.slice(0, 6).map((item) => ({
            value: item.name,
            product: item,
            label: (
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <img
                    src={item.image || "https://via.placeholder.com/40"}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.src =
                        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="100%" height="100%" fill="%23ddd"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="10" fill="%23666">No Img</text></svg>';
                    }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 6,
                      objectFit: "cover",
                    }}
                  />
                <div>
                  <div style={{ fontWeight: 500 }}>{item.name}</div>
                  <div style={{ color: "red" }}>
                    {item.price?.toLocaleString()}đ
                  </div>
                </div>
              </div>
            ),
          })),
        },
      ]);
    } catch (err) {
      console.log("Search error:", err);
      setOptions([]);
    }
  };

  // Debounce 300ms
  const handleSearch = useCallback(debounce(fetchSearch, 300), []);

  const handleSelect = (_, option) => {
    if (onSelectResult) onSelectResult(option.product);
  };

    return (
      <AutoComplete
        style={{ width: 420 }}
        styles={{
          popup: {
            root: {
              borderRadius: 10,
              padding: 5,
              background: "#fff",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            },
          },
        }}
      onSearch={handleSearch}
      onSelect={handleSelect}
      options={options}
    >
      <Input
        size="large"
        placeholder="Tìm sản phẩm..."
        prefix={<SearchOutlined style={{ fontSize: 20, color: "#555" }} />}
        style={{
          borderRadius: 20,
          paddingLeft: 15,
          background: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const query = e.target.value.trim();
            if (query && onSelectResult) {
              onSelectResult({
                id: null,
                name: query,
                isSearchText: true,
              });
            }
          }
        }}
      />
    </AutoComplete>
  );
}
