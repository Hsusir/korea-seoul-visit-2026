/**
 * Purpose: Switch among pre-trip information and daily itinerary panels.
 * Input: Tab clicks, arrow/Home/End keys, or a #prep/#arrival/#hotel/#uber/#day1–#day4 URL hash.
 * Output: The selected day panel, accessible tab state, and shareable URL hash.
 * Dependencies: None. Example: index.html#prep opens preparation notes.
 */
const tabs = Array.from(document.querySelectorAll('.day-tab'));
const tabList = document.querySelector('.day-tabs');
const panels = new Map(tabs.map(tab => [tab.dataset.day, document.getElementById(`panel-${tab.dataset.day}`)]));

function showDay(day, { focus = false, updateHash = true } = {}) {
  if (!panels.has(day)) return;
  tabs.forEach(tab => {
    const active = tab.dataset.day === day;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    panels.get(tab.dataset.day).hidden = !active;
    if (active && focus) tab.focus();
  });
  const activeTab = tabs.find(tab => tab.dataset.day === day);
  const tabBox = activeTab.getBoundingClientRect();
  const listBox = tabList.getBoundingClientRect();
  tabList.scrollLeft += tabBox.left - listBox.left - (tabList.clientWidth - tabBox.width) / 2;
  if (updateHash) history.replaceState(null, '', `#${day}`);
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => showDay(tab.dataset.day));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    showDay(tabs[next].dataset.day, { focus: true });
  });
});

window.addEventListener('hashchange', () => showDay(location.hash.slice(1), { updateHash: false }));
showDay(location.hash.slice(1) || 'prep', { updateHash: false });
