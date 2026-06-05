# EzClassPay Context

## Product Summary

EzClassPay is a web application for managing shared money collection rooms.
It is designed to solve the confusion that often happens when collecting money in groups, such as classroom funds, trip funds, office shared expenses, or other temporary group payments.

The product focuses on:

- Transparency: everyone can see their own payment status clearly.
- Traceability: payment slips and approval records can be checked later.
- Convenience: members can join rooms through links or QR codes.
- Reduced manual work: managers do not need to track slips through chat albums manually.

## Problem Statement

In many groups, shared money collection is handled through chat messages, manual spreadsheets, and payment slip photos sent into group chats.
This creates common problems:

- Slips get lost in chat history.
- Managers must manually compare names, amounts, and slips.
- Members are unsure whether their payment has been checked.
- The group cannot easily see who has paid or who still owes money.
- There is no clean audit trail for payment verification.

EzClassPay provides a structured room-based system for collecting, checking, and tracking payments.

## Main Users

### Manager

The Manager is the person responsible for a money collection room.

Managers can:

- Create money collection rooms.
- Set room names and collection goals.
- Choose payment patterns, such as one-time collection or monthly collection.
- Invite members through links or QR codes.
- Remove members from a room.
- Review uploaded payment slips.
- Approve or reject submitted payments.
- Track payment status for members in the room.

Managers are the paid subscription users when long-term usage is required.

### Member

The Member is a participant inside a money collection room.

Members can:

- Join rooms from invite links or QR codes.
- View outstanding balances.
- Pay through PromptPay.
- Upload payment slips.
- See payment status, such as pending, approved, or rejected.

Members use the system for free.

### Admin

The Admin manages the platform at the system level.

Admins can manage:

- Users
- Rooms
- Subscriptions
- Platform settings
- System-level reports or monitoring, if added later

## Core Modules

### 1. Room Management System

Rooms are the main workspace of EzClassPay.
Each room represents one money collection activity, such as a class fund, a trip, or an office expense pool.

Expected room capabilities:

- Create room.
- Edit room information.
- Set payment goal or collection amount.
- Choose collection pattern.
- Generate invite link.
- Generate QR code for joining.
- Manage room members.
- View room payment summary.

Possible collection patterns:

- One-time collection: members pay once for a specific purpose.
- Monthly collection: members pay recurring monthly amounts.

### 2. Role & Access System

Access is scoped by room.
A user may be a Manager in one room and a Member in another room.

Expected role behavior:

- Manager controls room settings and verifies payments.
- Member manages only their own payment actions.
- Admin manages platform-level resources and oversight.

Permission checks should always happen on the backend.
The frontend should use role data only for UI visibility and navigation.

### 3. Payment & Verification Flow

PromptPay is the primary payment method.

Basic flow:

1. Manager creates a room and sets payment details.
2. Member joins the room.
3. Member views the amount they need to pay.
4. Member pays through PromptPay.
5. Member uploads a payment slip.
6. Payment status becomes `pending`.
7. Manager reviews the slip and payment amount.
8. Manager approves or rejects the payment.
9. If approved, the member payment status becomes `paid`.
10. If rejected, the member should be able to view the reason and submit again.

## Payment Statuses

Recommended payment statuses:

- `unpaid`: member has not submitted payment yet.
- `pending`: member uploaded a slip and is waiting for manager review.
- `paid`: manager approved the payment.
- `rejected`: manager rejected the payment.

## Subscription Context

Managers are expected to be the paid users for long-term usage.
Members can use the system for free.

Possible subscription rules:

- Free trial or limited free usage for managers.
- Monthly subscription for continued room management.
- Subscription may control how many rooms a manager can create or how long rooms remain active.

Exact subscription rules are not finalized yet.

## Frontend Context

This repository is the frontend only.
The frontend should not access the database directly.
All data should come through the backend REST API.

Frontend responsibilities:

- Present role-specific screens.
- Show room and payment status clearly.
- Provide forms for room creation, member joining, and slip upload.
- Provide manager screens for reviewing payments.
- Keep API calls in `services/`.
- Keep shared role/payment types in `types/`.

## Backend Context

The expected backend stack is Go Fiber with PostgreSQL.

Expected backend responsibilities:

- Authentication and authorization.
- Room and member management.
- Payment slip records.
- Payment approval/rejection.
- Subscription enforcement.
- PostgreSQL persistence through migrations.

## Important Product Principles

- Keep the payment status obvious to members.
- Make manager review workflows fast and clear.
- Avoid hiding critical payment state behind decorative UI.
- Treat slip verification as an auditable action.
- Do not expose private payment data to users outside the room.
- Keep room-level permissions strict.

## Open Questions

These details should be clarified before implementation:

- What exact data is required when creating a room?
- How should one-time and monthly collection rules be represented?
- Will PromptPay QR codes be generated by the backend or frontend?
- Will slip verification be manual only, or will OCR/bank slip validation be added later?
- What subscription plans and limits should managers have?
- Can one room have multiple managers?
- Can members leave a room themselves?
- What should happen when a manager subscription expires?
- Should admins be able to approve/reject payments, or only managers?
