import { useState } from "react";
import { AutoComplete, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { elasticSearchApi } from "../unti/elasticSearch.js";

export default function HeaderSearch({ onSelectResult }) {
  const [options, setOptions] = useState([]);

  const handleSearch = async (value) => {
    if (!value) {
      setOptions([]);
      return;
    }

    try {
      const res = await elasticSearchApi(value); // gọi hàm API
      const data = res.data;

      setOptions(
        data.map((item) => ({
          value: item.name,
          product: item
        }))
      );
    } catch (err) {
      console.log("Search error:", err);
    }
  };

  const handleSelect = (value, option) => {
    if (onSelectResult) onSelectResult(option.product);
  };

  return (
    <AutoComplete
      style={{ width: 350 }}
      onSearch={handleSearch}
      onSelect={handleSelect}
      options={options}
      placeholder="Tìm sản phẩm..."
    >
      <Input
        size="large"
        prefix={<SearchOutlined />}
        className="rounded-lg shadow-sm"
      />
    </AutoComplete>
  );
}
