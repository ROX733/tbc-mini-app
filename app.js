// ==========================================
// TBC MINI APP - COMPLETE WORKING FRONTEND
// ==========================================

// Telegram Mini App
const tg = window.Telegram?.WebApp || null;

if (tg) {
    try {
        tg.ready();
        tg.expand();
    } catch (e) {
        console.log("Telegram WebApp unavailable");
    }
}

// ==========================================
// APP STATE
// ==========================================

const state = {
    balance: 125.50,
    todayEarning: 25.00,
    tasksDone: 18,
    referrals: 7,
    bonus: 40,
    giftClaimed: false
};

// ==========================================
// DEMO TASKS
// ==========================================

const tasks = [
    {
        id: 1,
        title: "Join Telegram Channel",
        reward: 5,
        type: "Telegram"
    },
    {
        id: 2,
        title: "Follow Social Page",
        reward: 10,
        type: "Social"
    },
    {
        id: 3,
        title: "Complete Daily Task",
        reward: 15,
        type: "Daily"
    }
];

// ==========================================
// DEMO ACTIVITY
// ==========================================

const activities = [
    {
        title: "Daily Bonus",
        amount: 10,
        time: "Today"
    },
    {
        title: "Task Completed",
        amount: 5,
        time: "Today"
    },
    {
        title: "Referral Bonus",
        amount: 10,
        time: "Yesterday"
    }
];

// ==========================================
// DEMO LEADERBOARD
// ==========================================

const leaderboard = [
    { name: "User 1", referrals: 25 },
    { name: "User 2", referrals: 19 },
    { name: "User 3", referrals: 15 },
    { name: "You", referrals: state.referrals }
];

// ==========================================
// HELPERS
// ==========================================

function $(id) {
    return document.getElementById(id);
}

function money(value) {
    return "₹" + Number(value || 0).toFixed(2);
}

function showMessage(message) {
    alert(message);
}

// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateDashboard() {

    const balanceElements = [
        $("balance"),
        $("totalBalance"),
        $("balanceAmount")
    ];

    balanceElements.forEach(el => {
        if (el) el.textContent = money(state.balance);
    });

    const todayElements = [
        $("todayEarning"),
        $("today-earning")
    ];

    todayElements.forEach(el => {
        if (el) el.textContent = money(state.todayEarning);
    });

    const taskElements = [
        $("tasksDone"),
        $("tasks-done")
    ];

    taskElements.forEach(el => {
        if (el) el.textContent = state.tasksDone;
    });

    const referralElements = [
        $("referrals"),
        $("referralCount")
    ];

    referralElements.forEach(el => {
        if (el) el.textContent = state.referrals;
    });

    const bonusElements = [
        $("bonus"),
        $("bonusAmount")
    ];

    bonusElements.forEach(el => {
        if (el) el.textContent = money(state.bonus);
    });
}

// ==========================================
// TASK RENDER
// ==========================================

function renderTasks() {

    const container =
        $("taskList") ||
        $("tasksList") ||
        $("featuredTasks");

    if (!container) return;

    container.innerHTML = "";

    tasks.forEach(task => {

        const item = document.createElement("div");

        item.className = "task-item";

        item.innerHTML = `
            <div>
                <strong>${task.title}</strong>
                <small>${task.type}</small>
            </div>

            <div>
                <strong>${money(task.reward)}</strong>
                <button type="button" data-task="${task.id}">
                    Start
                </button>
            </div>
        `;

        container.appendChild(item);
    });

    container.querySelectorAll("[data-task]").forEach(button => {

        button.addEventListener("click", function () {

            const id = Number(this.dataset.task);

            startTask(id);
        });
    });
}

// ==========================================
// START TASK
// ==========================================

function startTask(id) {

    const task = tasks.find(t => t.id === id);

    if (!task) {
        showMessage("Task not found.");
        return;
    }

    const confirmTask = confirm(
        `${task.title}\n\nReward: ${money(task.reward)}\n\nComplete this demo task?`
    );

    if (!confirmTask) return;

    state.balance += task.reward;
    state.todayEarning += task.reward;
    state.tasksDone += 1;

    updateDashboard();

    showMessage(
        `Task completed!\n\nYou earned ${money(task.reward)}`
    );
}

// ==========================================
// MODAL HELPERS
// ==========================================

function openModal(id) {

    const modal = $(id);

    if (!modal) return;

    modal.style.display = "flex";
    modal.classList.add("active");
}

function closeModal(id) {

    const modal = $(id);

    if (!modal) return;

    modal.style.display = "none";
    modal.classList.remove("active");
}

// Close buttons
document.addEventListener("click", function (event) {

    const closeButton = event.target.closest(
        "[data-close], .close, .modal-close"
    );

    if (!closeButton) return;

    const modal = closeButton.closest(".modal");

    if (modal) {
        modal.style.display = "none";
        modal.classList.remove("active");
    }
});

// Close modal when clicking outside
document.addEventListener("click", function (event) {

    if (!event.target.classList.contains("modal")) return;

    event.target.style.display = "none";
    event.target.classList.remove("active");
});

// ==========================================
// DAILY GIFT
// ==========================================

function claimGift() {

    if (state.giftClaimed) {
        showMessage("🎁 You already claimed today's gift.");
        return;
    }

    const reward = 10;

    state.giftClaimed = true;
    state.balance += reward;
    state.todayEarning += reward;
    state.bonus += reward;

    updateDashboard();

    showMessage(
        `🎁 Gift claimed!\n\nYou received ${money(reward)}`
    );
}

// ==========================================
// REFERRAL
// ==========================================

function getReferralLink() {

    let userId = "demo";

    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        userId = tg.initDataUnsafe.user.id;
    }

    return `https://t.me/YOUR_BOT_USERNAME?start=${userId}`;
}

function copyReferral() {

    const link = getReferralLink();

    if (navigator.clipboard) {

        navigator.clipboard.writeText(link)
            .then(() => {
                showMessage("✅ Referral link copied!");
            })
            .catch(() => {
                showMessage(link);
            });

    } else {

        showMessage(link);
    }
}

// ==========================================
// LEADERBOARD
// ==========================================

function showLeaderboard() {

    let text = "🏆 LEADERBOARD\n\n";

    leaderboard.forEach((user, index) => {

        text += `${index + 1}. ${user.name} — ${user.referrals} referrals\n`;
    });

    showMessage(text);
}

// ==========================================
// ACTIVITY
// ==========================================

function showActivity() {

    let text = "📊 RECENT ACTIVITY\n\n";

    activities.forEach(activity => {

        text +=
            `${activity.title}\n` +
            `+${money(activity.amount)} • ${activity.time}\n\n`;
    });

    showMessage(text);
}

// ==========================================
// WITHDRAW
// ==========================================

function withdraw() {

    if (state.balance <= 0) {
        showMessage("Your balance is empty.");
        return;
    }

    const amountText = prompt(
        `Available balance: ${money(state.balance)}\n\nEnter withdrawal amount:`
    );

    if (amountText === null) return;

    const amount = Number(amountText);

    if (!Number.isFinite(amount) || amount <= 0) {
        showMessage("❌ Enter a valid amount.");
        return;
    }

    if (amount > state.balance) {
        showMessage("❌ Insufficient balance.");
        return;
    }

    state.balance -= amount;

    updateDashboard();

    showMessage(
        `✅ Withdrawal request created for ${money(amount)}.\n\nDemo mode: no real payment was sent.`
    );
}

// ==========================================
// NAVIGATION
// ==========================================

function navigate(section) {

    const target = $(section);

    if (target) {

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        return;
    }

    showMessage(`${section} section opened.`);
}

// ==========================================
// GENERIC BUTTON HANDLER
// ==========================================

document.addEventListener("click", function (event) {

    const button = event.target.closest("button, a");

    if (!button) return;

    const text =
        (button.innerText || button.textContent || "")
            .trim()
            .toLowerCase();

    // Tasks
    if (
        text.includes("task") &&
        !text.includes("complete")
    ) {
        const taskSection =
            $("tasks") ||
            $("taskSection") ||
            $("featuredTasks");

        if (taskSection) {
            taskSection.scrollIntoView({
                behavior: "smooth"
            });
        }

        return;
    }

    // Gift
    if (
        text.includes("gift") ||
        text.includes("daily bonus")
    ) {
        claimGift();
        return;
    }

    // Referral
    if (
        text.includes("referral") ||
        text.includes("invite")
    ) {
        copyReferral();
        return;
    }

    // Leaderboard
    if (
        text.includes("rank") ||
        text.includes("leaderboard")
    ) {
        showLeaderboard();
        return;
    }

    // Activity
    if (
        text.includes("activity") ||
        text.includes("history")
    ) {
        showActivity();
        return;
    }

    // Withdraw
    if (
        text.includes("withdraw") ||
        text.includes("cash out")
    ) {
        withdraw();
        return;
    }
});

// ==========================================
// TELEGRAM USER
// ==========================================

function showTelegramUser() {

    if (!tg) return;

    const user =
        tg.initDataUnsafe &&
        tg.initDataUnsafe.user;

    if (!user) return;

    const name =
        user.first_name ||
        user.username ||
        "User";

    const nameElements = [
        $("userName"),
        $("username"),
        $("welcomeName")
    ];

    nameElements.forEach(el => {

        if (el) {
            el.textContent = name;
        }
    });
}

// ==========================================
// TELEGRAM MAIN BUTTON
// ==========================================

function setupTelegramButton() {

    if (!tg || !tg.MainButton) return;

    try {

        tg.MainButton.setText("OPEN TASKS");

        tg.MainButton.onClick(function () {

            const taskSection =
                $("tasks") ||
                $("taskSection") ||
                $("featuredTasks");

            if (taskSection) {

                taskSection.scrollIntoView({
                    behavior: "smooth"
                });

            } else {

                showMessage("Tasks opened.");
            }
        });

    } catch (e) {
        console.log("Telegram MainButton unavailable");
    }
}

// ==========================================
// KEYBOARD / ESC
// ==========================================

document.addEventListener("keydown", function (event) {

    if (event.key !== "Escape") return;

    document.querySelectorAll(".modal").forEach(modal => {

        modal.style.display = "none";
        modal.classList.remove("active");

    });
});

// ==========================================
// INITIALIZE
// ==========================================

function initApp() {

    console.log("TBC Mini App loaded successfully.");

    updateDashboard();
    renderTasks();
    showTelegramUser();
    setupTelegramButton();

}

// Run after page loads
if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initApp
    );

} else {

    initApp();
}
