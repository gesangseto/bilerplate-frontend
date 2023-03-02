export function get_layout() {
  return [
    { id: 1, name: "Carton_SER", created_at: "", updated_at: "", status: 0 },
    { id: 2, name: "Car_NON_SER", created_at: "", updated_at: "", status: 1 },
    { id: 3, name: "Pal_SER", created_at: "", updated_at: "", status: 1 },
    { id: 4, name: "Pal_NON_SER", created_at: "", updated_at: "", status: 0 },
  ];
}
export function get_date() {
  return [
    {
      df_id: 1,
      df_name: "(YYYY-MM-DD)",
      df_delimeter: "-",
      df_around: "()",
      df_field1: "DD",
      df_field2: "YYYY",
      df_field3: "mm",
      df_overwrite: "no_overwrite",
    },
  ];
}
export function get_layout_field() {
  return [
    { id: 1, layout_id: 1, name: "Bar Code A", generate_type_id: 1 },
    { id: 2, layout_id: 1, name: "Bar Code B", generate_type_id: 2 },
    { id: 3, layout_id: 1, name: "Var A", generate_type_id: 3 },
  ];
}
export function get_generate_type() {
  return [
    { id: 1, name: "GS1 AI", type: "MULTIPLE" },
    { id: 2, name: "GS1 HR", type: "MULTIPLE" },
    { id: 3, name: "Variable", type: "SINGLE" },
  ];
}
export function get_associated() {
  return [
    { id: 1, layout_field_id: 1, identifier_id: 1 },
    { id: 2, layout_field_id: 1, identifier_id: 2 },
    { id: 3, layout_field_id: 2, identifier_id: 3 },
    { id: 4, layout_field_id: 3, identifier_id: 4 },
  ];
}
export function get_group_identifier() {
  return [
    { id: 1, generate_type_id: 1, identifier_id: 1 },
    { id: 2, generate_type_id: 1, identifier_id: 2 },
    { id: 3, generate_type_id: 1, identifier_id: 3 },
    { id: 4, generate_type_id: 2, identifier_id: 1 },
    { id: 5, generate_type_id: 2, identifier_id: 2 },
    { id: 6, generate_type_id: 2, identifier_id: 3 },
    { id: 7, generate_type_id: 3, identifier_id: 4 },
    { id: 10, generate_type_id: 1, identifier_id: 10 },
  ];
}
export function get_identifier() {
  return [
    {
      id: 1,
      name: "SSCC",
      ai: "00",
      data_type: "",
      format_ref: "",
      type: "AI",
      table_name: "product_stock_serial",
      table_column: "GTIN_SSCC",
    },
    {
      id: 2,
      name: "GTIN",
      ai: "01",
      data_type: "",
      format_ref: "",
      type: "AI",
      table_name: "product_stock_serial",
      table_column: "GTIN_SSCC",
    },
    {
      id: 3,
      name: "BATCH",
      ai: "10",
      data_type: "",
      format_ref: "",
      type: "AI",
      table_name: "product_stock_serial",
      table_column: "batch_no",
    },
    {
      id: 10,
      name: "EXP Date",
      ai: "17",
      data_type: "",
      format_ref: "",
      type: "AI",
      table_name: "product_stock_batch",
      table_column: "expired_date",
    },
    {
      id: 4,
      name: "PRICE",
      ai: "",
      data_type: "",
      format_ref: "",
      type: "VARIABLE",
      table_name: "product_stock_batch",
      table_column: "het",
    },
  ];
}

export function get_layout_data() {
  return {
    name: "Carton_SER",
    file_name: "Carton_SER.itf",
    created_at: "",
    updated_at: "",
    status: "1",
    layout_field: [
      {
        id: 1,
        layout_id: 1,
        name: "Bar Code A",
        generate_type_id: 1,
        generate_type_name: "GS1 AI",
        type: "MULTIPLE",
        identifier: [
          {
            id: 1,
            name: "SSCC",
            ai: "00",
            data_type: "",
            format_ref: "",
            type: "AI",
            table_name: "product_stock_serial",
            table_column: "GTIN_SSCC",
          },
          {
            id: 3,
            name: "BATCH",
            ai: "10",
            data_type: "",
            format_ref: "",
            type: "AI",
            table_name: "product_stock_serial",
            table_column: "batch_no",
          },
        ],
      },
      {
        id: 2,
        layout_id: 1,
        name: "Bar Code B",
        generate_type_id: 2,
        generate_type_name: "GS1 HR",
        type: "MULTIPLE",
        identifier: [
          {
            id: 2,
            name: "GTIN",
            ai: "01",
            data_type: "",
            format_ref: "",
            type: "AI",
            table_name: "product_stock_serial",
            table_column: "GTIN_SSCC",
          },
          {
            id: 3,
            name: "BATCH",
            ai: "10",
            data_type: "",
            format_ref: "",
            type: "AI",
            table_name: "product_stock_serial",
            table_column: "batch_no",
          },
        ],
      },
      {
        id: 3,
        layout_id: 1,
        name: "Var A",
        generate_type_id: 3,
        generate_type_name: "VARIABLE",
        type: "SINGLE",
        identifier: [
          {
            id: 4,
            name: "PRICE",
            ai: "",
            data_type: "",
            format_ref: "",
            type: "VARIABLE",
            table_name: "product_stock_batch",
            table_column: "het",
          },
        ],
      },
    ],
  };
}

export function get_log() {
  return [
    {
      api_log_id: "05766C9B-2355-4349-9DBC-B6CEF0DB7823",
      val1: "PostMobile",
      val2: "userLogin",
      val3: `{
        "email": "adm",
        "password": "Mm1689"
      }`,
      val4: "",
      val5: "",
      created_date: "2022-06-28 16:36:18",
    },
    {
      api_log_id: "05B87995-9B12-415C-960B-5FF9E2B351B2",
      val1: "PostMobile",
      val2: "ReAggregationInput",
      val3: `{
        "barcode_2d": "004899701285972012421017A02Ku001d17250218",
        "sscc": "489970128597201242",
        "batch_no": "17A02K",
        "exp": "2025-01-07",
        "add": false,
        "items": [
          {
            "barcode_2d": "01089970128502541017A02Ku001d172502182110000RYC",
            "gtin": "08997012850254",
            "batch_no": "17A02K",
            "exp": "2025-02-18",
            "serial": "10000RYC"
          }
        ]
      }`,
      val4: "",
      val5: "",
      created_date: "2022-06-28 16:36:18",
    },
  ];
}
