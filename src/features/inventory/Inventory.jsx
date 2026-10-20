import React from "react";
import {
  useParams,
  useSearchParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useClinic } from "../../app/ClinicProvider.jsx";
import {
  Heading,
  Card,
  Button,
  Field,
  Badge,
  ErrorBox,
  useDirtyGuard,
  when,
} from "../../components/ui.jsx";
import { useForm } from "../../components/useForm.js";
import { adjustStock } from "../../../js/inventory.js";
const badge = (i) =>
  i.quantity === 0
    ? "Out of stock"
    : i.quantity <= i.lowAt
      ? "Low stock"
      : "In stock";
export function Inventory() {
  const c = useClinic(),
    { id } = useParams(),
    location = useLocation(),
    [params, setParams] = useSearchParams(),
    action =
      location.pathname.split("/")[3] ||
      (id === "add" ? "add" : id ? "history" : ""),
    item = c.data.inventory.find((i) => i.id === id);
  if (id === "add" || ["add", "adjust"].includes(action))
    return <StockForm key={location.pathname} item={item} action={action} />;
  if (id && !item)
    return (
      <>
        <Heading>Stock item not found</Heading>
        <Button to="/inventory">Back to inventory</Button>
      </>
    );
  if (item)
    return (
      <>
        <Heading>Stock history</Heading>
        <Card title={item.name + " · Stock history"} icon="history">
          <p>
            {item.quantity} {item.unit} available
          </p>
          <Badge>{badge(item)}</Badge>
          <div className="result-list">
            {c.data.stockMovements
              ?.filter((m) => m.itemId === id)
              .slice()
              .reverse()
              .map((m) => (
                <article className="note" key={m.id}>
                  <strong>
                    {when(m.at)} ·{" "}
                    {m.kind === "opening"
                      ? "Opening count"
                      : m.delta < 0
                        ? "Used / removed"
                        : "Added / returned"}{" "}
                    {Math.abs(m.delta)} {item.unit}
                  </strong>
                  <p className="note-text">
                    {m.reason} · Recorded by {m.actor}
                  </p>
                  <p className="small muted">
                    Balance: {m.balance} {item.unit}
                  </p>
                  {m.visitId && (
                    <Button to={"/visits/" + m.visitId}>View visit</Button>
                  )}
                </article>
              ))}
            {!c.data.stockMovements?.some((m) => m.itemId === id) && (
              <p>Stock history is not available from this API.</p>
            )}
          </div>
          <div className="actions">
            <Button to="/inventory">Back to inventory</Button>
            <Button
              primary
              disabled={c.mode === "api"}
              to={"/inventory/" + id + "/add"}
            >
              Add stock
            </Button>
            <Button
              disabled={c.mode === "api"}
              to={"/inventory/" + id + "/adjust"}
            >
              Adjust stock
            </Button>
          </div>
        </Card>
      </>
    );
  const q = params.get("q") || "",
    low = params.get("stock") === "low",
    items = c.data.inventory.filter(
      (i) =>
        i.name.toLowerCase().includes(q.toLowerCase()) &&
        (!low || i.quantity <= i.lowAt),
    );
  return (
    <>
      <Heading sub="Manage medicines and clinic supplies.">
        {low ? "Low stock" : "Inventory"}
      </Heading>
      <Card title="Clinic stock" icon="patients">
        <Field
          label="Search items"
          name="stock-query"
          value={q}
          onChange={(q) =>
            setParams({ q, stock: low ? "low" : "all" }, { replace: true })
          }
          placeholder="Search medicine or supply"
        />
        <nav className="actions">
          <Button
            to={"/inventory?" + new URLSearchParams({ q, stock: "all" })}
            className={!low ? "filter-selected" : ""}
          >
            All items
          </Button>
          <Button
            to={"/inventory?" + new URLSearchParams({ q, stock: "low" })}
            className={low ? "filter-selected" : ""}
          >
            Low stock
          </Button>
          <Button primary disabled={c.mode === "api"} to="/inventory/add">
            Add stock
          </Button>
        </nav>
        <div id="stock-results" className="result-list">
          {items.map((i) => (
            <article className="patient-row" key={i.id}>
              <div className="patient-info">
                <strong>{i.name}</strong>
                <p className="small muted">
                  {i.quantity} {i.unit} available
                </p>
              </div>
              <Badge>{badge(i)}</Badge>
              <Button to={"/inventory/" + i.id + "/history"}>Open</Button>
            </article>
          ))}
          {!items.length && (
            <p>
              No items match these filters. Try another name or choose All
              items.
            </p>
          )}
        </div>
      </Card>
      <p className="small muted">
        {c.mode === "demo"
          ? "Opening counts are demo values. Use Adjust stock after counting your supplies. Low-stock labels use the item’s demo threshold."
          : "This API returns positive stock only. Count adjustments and complete stock history are not available yet."}
      </p>
    </>
  );
}
function StockForm({ item, action }) {
  const c = useClinic(),
    nav = useNavigate(),
    f = useForm(
      {
        itemId: item?.id || "",
        quantity: action === "adjust" ? (item?.quantity ?? "") : "",
        reason: "",
      },
      c.data.revision,
    ),
    v = f.values,
    selected = c.data.inventory.find((i) => i.id === v.itemId),
    adding = action === "add",
    guard = useDirtyGuard(f.dirty);
  return (
    <>
      <Heading
        sub={
          adding
            ? "Record incoming medicine or supplies."
            : "Correct the counted quantity and keep a reason in history."
        }
      >
        {adding ? "Add stock" : "Adjust stock"}
      </Heading>
      <Card
        title={adding ? "Stock addition" : "Correct a stock count"}
        icon="inventory"
      >
        <form
          id="stock-form"
          className="form-stack"
          onSubmit={(e) => {
            e.preventDefault();
            try {
              c.mutate((s, a, t) => {
                const current = s.inventory.find((i) => i.id === v.itemId);
                const qty = Number(v.quantity);
                if (adding && qty <= 0)
                  throw Error("Enter a positive quantity to add.");
                adjustStock(
                  s,
                  v.itemId,
                  adding ? qty : qty - current.quantity,
                  v.reason,
                  a,
                  t,
                );
              }, f.rev.current);
              f.clean();
              nav("/inventory/" + v.itemId + "/history");
            } catch (e) {
              f.setError(e.message);
            }
          }}
        >
          <ErrorBox error={f.error} />
          <fieldset
            disabled={c.mode === "api"}
            className="borderless form-stack"
          >
            {item ? (
              <Field label="Item" name="itemName" value={item.name} readOnly />
            ) : (
              <Field
                label="Item"
                name="itemId"
                options={[
                  ["", "Choose an item"],
                  ...c.data.inventory.map((i) => [i.id, i.name]),
                ]}
                value={v.itemId}
                onChange={(x) => f.change("itemId", x)}
                required
              />
            )}
            <Field
              label={adding ? "Quantity to add" : "Correct quantity"}
              name="quantity"
              type="number"
              min={adding ? selected?.step || 1 : 0}
              step={selected?.step || 1}
              required
              value={v.quantity}
              onChange={(x) => f.change("quantity", x)}
            />
            <Field
              label="Unit"
              name="stock-unit"
              value={selected?.unit || ""}
              readOnly
            />
            <p className="small muted">
              {selected && `Use steps of ${selected.step} ${selected.unit}.`}
            </p>
            <Field
              label={adding ? "Reason / notes" : "Reason for adjustment"}
              name="reason"
              note
              required
              value={v.reason}
              onChange={(x) => f.change("reason", x)}
            />
            <div className="actions">
              <Button primary type="submit">
                {adding ? "Save stock addition" : "Save adjustment"}
              </Button>
              {item && (
                <Button to={"/inventory/" + item.id + "/history"}>
                  View history
                </Button>
              )}
              <Button to="/inventory">Cancel</Button>
            </div>
          </fieldset>
        </form>
      </Card>
      {guard}
    </>
  );
}
