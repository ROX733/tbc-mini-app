// ==========================================
// TBC MINI APP - FRONTEND DEMO
// ==========================================

// Telegram Mini App
const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
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
// TASK DATA
// ==========================================

const tasks = [
    {
        icon: "📱",
        title: "Install & Open",
        description: "Install the application and open it",
        reward: 5.00
    },
    {
        icon: "▶️",
        title: "Watch & Stay",
        description: "Watch the sponsored video",
        reward: 8.00
    },
    {
        icon: "🎮",
        title: "Trial Done",
        description: "Complete the trial activity",
        reward: 12.00
    },
    {
        icon: "📝",
        title: "Quick Survey",
        description: "Complete a short survey",
        reward: 3.50
    }
];

// ==========================================
// ACTIVITY DATA
// ==========================================

const activities = [
    {
        icon: "⚡",
        title: "Install Done",
        time: "Today • 8:42 PM",
        amount: 5.00
    },
    {
        icon: "🎁",
        title: "Daily Gift",
        time: "Today • 1:15 PM",
        amount: 10.00
    },
    {
        icon: "👥",
        title: "Referral Bonus",
        time: "Yesterday",
        amount: 7.50
    }
];

// ==========================================
// LEADERBOARD
// ==========================================

const leaderboard = [
    {
        position: 1,
        name: "Aman",
        earning: 1240
    },
    {
        position: 2,
        name: "Rohit",
        earning: 980
    },
    {
        position: 3,
        name: "Papai",
        earning: 760
    },
    {
        position: 4,
        name: "Sahil",
        earning: 690
    },
    {
        position: 5,
        name: "Karan",
        earning: 540
    }
];

// ==========================================
// HELPER
// ==========================================

function getElement(id) {
    return document.getElementById(id);
}

function formatMoney(amount) {
    return Number(amount).toFixed(2);
}

// ==========================================
// UPDATE BALANCE / STATS
// ==========================================

function updateUI() {

    const balance = getElement("balance");
    const todayEarn = getElement("todayEarn");
    const tasksDone = getElement("tasksDone");
    const referrals = getElement("referrals");
    const bonus = getElement("bonus");

    if (balance) {
        balance.textContent = formatMoney(state.balance);
    }

    if (todayEarn) {
        todayEarn.textContent = "₹" + formatMoney(state.todayEarning);
    }

    if (tasksDone) {
        tasksDone.textContent = state.tasksDone;
    }

    if (referrals) {
        referrals.textContent = state.referrals;
    }

    if (bonus) {
        bonus.textContent = "₹" + state.bonus;
    }
}

// ==========================================
// RENDER TASKS
// ==========================================

function renderTasks(limit = 3) {

    const container = getElement("featuredTasks");

    if (!container) {
        return;
    }

    const selectedTasks = tasks.slice(0, limit);

    container.innerHTML = selectedTasks.map((task, index) => {

        return `
            <div class="task">

                <div class="task-icon">
                    ${task.icon}
                </div>

                <div class="task-info">
                    <b>${task.title}</b>
                    <small>${task.description}</small>
                </div>

                <div>
                    <div class="task-reward">
                        ₹${formatMoney(task.reward)}
                    </div>

                    <button
                        class="task-btn"
                        data-task-index="${index}">
                        START
                    </button>
                </div>

            </div>
        `;

    }).join("");

    document.querySelectorAll(".task-btn").forEach(button => {

        button.addEventListener("click", function () {

            const index = Number(
                this.getAttribute("data-task-index")
            );

            startTask(index);

        });

    });
}

// ==========================================
// RENDER ACTIVITY
// ==========================================

function renderActivity() {

    const container = getElement("activityList");

    if (!container) {
        return;
    }

    container.innerHTML = activities.map(activity => {

        const sign = activity.amount >= 0 ? "+" : "";

        return `
            <div class="activity">

                <div class="activity-icon">
                    ${activity.icon}
                </div>

                <div class="activity-main">

                    <b>${activity.title}</b>

                    <small>
                        ${activity.time}
                    </small>

                </div>

                <div class="activity-amount">
                    ${sign}₹${formatMoney(activity.amount)}
                </div>

            </div>
        `;

    }).join("");
}

// ==========================================
// MODAL
// ==========================================

function openModal(content) {

    const modal = getElement("modal");
    const modalContent = getElement("modalContent");

    if (!modal || !modalContent) {
        return;
    }

    modalContent.innerHTML = content;

    modal.classList.remove("hidden");
}

function closeModal() {

    const modal = getElement("modal");

    if (!modal) {
        return;
    }

    modal.classList.add("hidden");
}

// ==========================================
// CLOSE BUTTON
// ==========================================

const closeModalButton = getElement("closeModal");

if (closeModalButton) {

    closeModalButton.addEventListener(
        "click",
        closeModal
    );

}

// ==========================================
// MODAL BACKDROP
// ==========================================

const modalBackdrop =
    document.querySelector(".modal-backdrop");

if (modalBackdrop) {

    modalBackdrop.addEventListener(
        "click",
        closeModal
    );

}

// ==========================================
// START TASK
// ==========================================

function startTask(index) {

    const task = tasks[index];

    if (!task) {
        return;
    }

    openModal(`

        <h3>
            ${task.icon} ${task.title}
        </h3>

        <p>
            ${task.description}
        </p>

        <p>
            Reward:
            <strong style="color:#5df58c">
                ₹${formatMoney(task.reward)}
            </strong>
        </p>

        <p>
            This is currently a demo task.
            In the production version, your backend
            will verify the task before adding the
            reward to the user's balance.
        </p>

        <button
            class="modal-action"
            id="demoCompleteButton">

            DEMO COMPLETE

        </button>

    `);

    const completeButton =
        getElement("demoCompleteButton");

    if (completeButton) {

        completeButton.addEventListener(
            "click",
            function () {

                finishDemoTask(
                    task.title,
                    task.reward,
                    task.icon
                );

            }
        );

    }
}

// ==========================================
// COMPLETE DEMO TASK
// ==========================================

function finishDemoTask(
    title,
    reward,
    icon
) {

    state.balance += reward;

    state.todayEarning += reward;

    state.tasksDone += 1;

    activities.unshift({

        icon: icon || "⚡",

        title: title,

        time: "Just now",

        amount: reward

    });

    updateUI();

    renderActivity();

    closeModal();

    showSuccess(
        "Task completed!",
        `₹${formatMoney(reward)} added to demo balance.`
    );
}

// ==========================================
// SUCCESS MESSAGE
// ==========================================

function showSuccess(title, message) {

    openModal(`

        <h3>
            🎉 ${title}
        </h3>

        <p>
            ${message}
        </p>

        <button
            class="modal-action"
            id="successClose">

            DONE

        </button>

    `);

    const button = getElement("successClose");

    if (button) {

        button.addEventListener(
            "click",
            closeModal
        );

    }
}

// ==========================================
// NAVIGATION
// ==========================================

function openTab(tab) {

    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.tab === tab
            );

        });

    if (tab === "home") {

        renderTasks(3);
        renderActivity();

        return;
    }

    if (tab === "earn") {

        showEarnPage();

        return;
    }

    if (tab === "gift") {

        showGiftPage();

        return;
    }

    if (tab === "rank") {

        showRankPage();

        return;
    }
}

// ==========================================
// NAVIGATION BUTTONS
// ==========================================

document
    .querySelectorAll("[data-tab]")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const tab =
                    this.getAttribute("data-tab");

                openTab(tab);

            }
        );

    });

// ==========================================
// EARN PAGE
// ==========================================

function showEarnPage() {

    const taskHTML = tasks.map(
        (task, index) => {

            return `

                <div class="task">

                    <div class="task-icon">
                        ${task.icon}
                    </div>

                    <div class="task-info">

                        <b>
                            ${task.title}
                        </b>

                        <small>
                            ${task.description}
                        </small>

                    </div>

                    <div>

                        <div class="task-reward">
                            ₹${formatMoney(task.reward)}
                        </div>

                        <button
                            class="task-btn earn-task-button"
                            data-index="${index}">

                            START

                        </button>

                    </div>

                </div>

            `;

        }
    ).join("");

    openModal(`

        <h3>
            ⚡ Earn Tasks
        </h3>

        <p>
            Complete tasks and earn rewards.
        </p>

        ${taskHTML}

    `);

    document
        .querySelectorAll(".earn-task-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            this.dataset.index
                        );

                    startTask(index);

                }
            );

        });
}

// ==========================================
// DAILY GIFT
// ==========================================

function showGiftPage() {

    if (state.giftClaimed) {

        openModal(`

            <h3>
                🎁 Daily Gift
            </h3>

            <p>
                You have already claimed today's
                demo gift.
            </p>

        `);

        return;
    }

    openModal(`

        <h3>
            🎁 Daily Gift
        </h3>

        <p>
            Claim your daily reward.
        </p>

        <p>
            Today's reward:
            <strong style="color:#5df58c">
                ₹10.00
            </strong>
        </p>

        <button
            class="modal-action"
            id="claimGiftButton">

            CLAIM ₹10

        </button>

    `);

    const button =
        getElement("claimGiftButton");

    if (button) {

        button.addEventListener(
            "click",
            claimGift
        );

    }
}

// ==========================================
// CLAIM GIFT
// ==========================================

function claimGift() {

    if (state.giftClaimed) {
        return;
    }

    state.giftClaimed = true;

    state.balance += 10;

    state.todayEarning += 10;

    state.bonus += 10;

    activities.unshift({

        icon: "🎁",

        title: "Daily Gift",

        time: "Just now",

        amount: 10

    });

    updateUI();

    renderActivity();

    openModal(`

        <h3>
            🎉 Gift Claimed!
        </h3>

        <p>
            ₹10.00 has been added to your
            demo balance.
        </p>

        <button
            class="modal-action"
            id="giftDone">

            DONE

        </button>

    `);

    const done =
        getElement("giftDone");

    if (done) {

        done.addEventListener(
            "click",
            closeModal
        );

    }
}

// ==========================================
// LEADERBOARD
// ==========================================

function showRankPage() {

    const rows = leaderboard.map(
        user => {

            return `

                <div class="rank-row">

                    <div class="rank-num">
                        #${user.position}
                    </div>

                    <div class="rank-avatar">
                        👤
                    </div>

                    <div class="rank-name">
                        ${user.name}
                    </div>

                    <div class="rank-score">
                        ₹${formatMoney(user.earning)}
                    </div>

                </div>

            `;

        }
    ).join("");

    openModal(`

        <h3>
            🏆 Leaderboard
        </h3>

        <p>
            Top earners based on referral and
            task earnings.
        </p>

        ${rows}

    `);
}

// ==========================================
// WITHDRAW
// ==========================================

const withdrawButton =
    getElement("withdrawBtn");

if (withdrawButton) {

    withdrawButton.addEventListener(
        "click",
        function () {

            openModal(`

                <h3>
                    💸 Withdraw
                </h3>

                <p>
                    Your current balance is:
                    <strong style="color:#5df58c">
                        ₹${formatMoney(state.balance)}
                    </strong>
                </p>

                <p>
                    The real withdrawal system will
                    be connected to your backend later.
                </p>

                <button
                    class="modal-action"
                    id="withdrawInfo">

                    OK

                </button>

            `);

            const button =
                getElement("withdrawInfo");

            if (button) {

                button.addEventListener(
                    "click",
                    closeModal
                );

            }

        }
    );

}

// ==========================================
// REFERRAL
// ==========================================

const referButton =
    getElement("referBtn");

if (referButton) {

    referButton.addEventListener(
        "click",
        showReferral
    );

}

function showReferral() {

    let telegramId = "123456";

    if (
        tg &&
        tg.initDataUnsafe &&
        tg.initDataUnsafe.user &&
        tg.initDataUnsafe.user.id
    ) {

        telegramId =
            tg.initDataUnsafe.user.id;

    }

    const referralLink =
        `https://t.me/YourBot?start=ref_${telegramId}`;

    openModal(`

        <h3>
            👥 Invite & Earn
        </h3>

        <p>
            Invite your friends and earn referral
            rewards when they complete verified tasks.
        </p>

        <div style="
            background:#07100b;
            border:1px solid #20372a;
            border-radius:12px;
            padding:12px;
            font-size:11px;
            word-break:break-all;
            margin-top:10px;
        ">

            ${referralLink}

        </div>

        <button
            class="modal-action"
            id="copyReferralButton">

            COPY LINK

        </button>

    `);

    const copyButton =
        getElement("copyReferralButton");

    if (copyButton) {

        copyButton.addEventListener(
            "click",
            function () {

                copyReferralLink(
                    referralLink
                );

            }
        );

    }
}

// ==========================================
// COPY REFERRAL
// ==========================================

function copyReferralLink(link) {

    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        navigator.clipboard
            .writeText(link)
            .then(() => {

                openModal(`

                    <h3>
                        ✅ Copied
                    </h3>

                    <p>
                        Your referral link has been
                        copied successfully.
                    </p>

                `);

            })
            .catch(() => {

                showReferralText(link);

            });

    } else {

        showReferralText(link);

    }
}

function showReferralText(link) {

    openModal(`

        <h3>
            👥 Referral Link
        </h3>

        <p>
            Copy this link manually:
        </p>

        <p style="
            word-break:break-all;
            color:#5df58c;
        ">
            ${link}
        </p>

    `);
}

// ==========================================
// ACTIVITY
// ==========================================

const activityButton =
    getElement("activityBtn");

if (activityButton) {

    activityButton.addEventListener(
        "click",
        showActivity
    );

}

const historyButton =
    getElement("historyBtn");

if (historyButton) {

    historyButton.addEventListener(
        "click",
        showActivity
    );

}

function showActivity() {

    const rows = activities.map(
        activity => {

            return `

                <div class="activity">

                    <div class="activity-icon">
                        ${activity.icon}
                    </div>

                    <div class="activity-main">

                        <b>
                            ${activity.title}
                        </b>

                        <small>
                            ${activity.time}
                        </small>

                    </div>

                    <div class="activity-amount">
                        +₹${formatMoney(activity.amount)}
                    </div>

                </div>

            `;

        }
    ).join("");

    openModal(`

        <h3>
            📊 My Activity
        </h3>

        <p>
            Your latest earnings and rewards.
        </p>

        ${rows}

    `);
}

// ==========================================
// NOTIFICATIONS
// ==========================================

const notificationButton =
    getElement("notifyBtn");

if (notificationButton) {

    notificationButton.addEventListener(
        "click",
        function () {

            openModal(`

                <h3>
                    🔔 Notifications
     
