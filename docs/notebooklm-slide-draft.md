# VIVERSE SDK Skills Workshop

## Title
VIVERSE SDK Skills for AI IDEs: From Standalone App to Published VIVERSE World

## One-Sentence Summary
This workshop shows how a standalone web app can be turned into a VIVERSE world and then upgraded with platform capabilities by using reusable AI IDE skills for publishing, authentication, avatar integration, and leaderboard features.

## Audience Framing
This workshop is for people who already understand that AI can generate code, but want to see how AI can work more reliably on real platform integrations when the workflow knowledge is packaged as reusable skills.

## Core Thesis
The main value of the skill repository is not just faster code generation. The value is that it gives the AI IDE the correct integration order, deployment rules, runtime assumptions, and failure-prevention rules for real VIVERSE app development.

## Main Story Arc
The workshop follows a simple lifecycle:

1. Start from a standalone runnable app.
2. Publish the baseline app to VIVERSE.
3. Use AI IDE skills to integrate VIVERSE platform features.
4. Republish the upgraded version.
5. Compare the baseline and upgraded worlds.

## Demo Base
The baseline app is a standalone runnable hide-and-seek game.

It is intentionally set up to work before VIVERSE integration so it can serve as a clean before-state.

The app can be demonstrated locally first, but the real target runtime for the workshop is VIVERSE.

## Why Publish Comes First
For this demo, publish is not the last operational step.

Publish comes first because the app is meant to run on VIVERSE, and several VIVERSE capabilities only make sense when validated in the real platform runtime.

This means the workshop should introduce publishing before auth, avatar, and leaderboard.

## The First Skill: World Publishing
The first skill in the workshop is the VIVERSE world publishing skill.

Its purpose is to help the AI IDE determine the correct publish strategy, keep App ID handling consistent, avoid wrong-folder uploads, and deploy a shareable baseline world to VIVERSE.

This establishes the first important idea of the workshop: deployment knowledge is part of the skill system, not separate from it.

## Baseline World
After publishing, the workshop has its first real milestone:

A baseline VIVERSE world that runs on the platform but does not yet use VIVERSE login, authenticated avatar loading, or leaderboard submission.

This is the first shareable version.

## The Second Skill: Auth
The next skill is VIVERSE auth.

This skill teaches the AI IDE how to integrate login correctly, including app ID resolution, SDK detection, handshake timing, and profile fallback behavior.

The important workshop point is that the AI is not inventing an auth flow from scratch. It is following a grounded VIVERSE integration playbook.

## The Third Skill: Avatar
After auth, the next skill is the avatar SDK skill.

This skill upgrades the game from a generic placeholder player representation to the authenticated user’s VIVERSE avatar.

This is the most visible transformation in the workshop and is the strongest feature-level demo moment.

## The Fourth Skill: Leaderboard
The next skill is leaderboard integration.

This skill adds score submission and ranking display, but also includes the platform-specific rules around Studio configuration, score upload shape, result deduplication, and ranking fetch behavior.

This demonstrates that skills encode operational knowledge, not just UI code.

## Before And After
The workshop should emphasize the difference between two published versions of the same app:

1. Baseline world: published, runnable, but missing platform identity and competitive features.
2. Upgraded world: published again after skill-based integration, now with login, personalized avatar, and leaderboard behavior.

This makes the value of the skill system concrete.

## Main Lesson
The most important lesson is that AI IDE workflows become more reliable when integration knowledge is externalized into reusable skills.

Instead of relying on a model to remember scattered documentation, the skill repository supplies the rules, sequence, and guardrails needed for real platform work.

## Secondary Lesson
The second lesson is that deployment and runtime context must be treated as part of the engineering workflow.

In this workshop, publish is a prerequisite for meaningful platform validation, not just a release checkbox.

## Suggested Slide Flow
Slide 1: Title and thesis

Slide 2: The problem with AI-only prompting on SDK integrations

Slide 3: What a skill is

Slide 4: The workshop lifecycle from standalone app to upgraded VIVERSE world

Slide 5: The standalone baseline app

Slide 6: Why publish comes before integration in this demo

Slide 7: Publish skill as the first platform workflow

Slide 8: Baseline world running on VIVERSE

Slide 9: Auth skill integration

Slide 10: Avatar skill integration

Slide 11: Leaderboard skill integration

Slide 12: Baseline world versus upgraded world

Slide 13: What skills add beyond plain prompting

Slide 14: Final takeaways

## Speaker Framing Notes
When describing the workshop, avoid presenting the baseline app as incomplete or weak.

Instead, frame it as a deliberate standalone starting point that makes the value of the later integrations easy to observe.

When describing publish, emphasize that this is part of the AI skill story, not a separate DevOps afterthought.

When describing auth, avatar, and leaderboard, keep repeating the same point: the AI is successful because it is using packaged platform knowledge.

## Closing Message
The workshop demonstrates that VIVERSE SDK Skills are not just reusable prompts.

They are reusable AI workflows for platform-aware development.

By starting from a standalone app, publishing it to the real runtime, and then layering in VIVERSE capabilities through skills, the workshop shows how AI IDEs can become more reliable, more repeatable, and more useful for real product work.

## Short Version For Slide Generation
This workshop starts with a standalone runnable game, publishes it to VIVERSE as a baseline world, then uses AI IDE skills to integrate publishing, authentication, avatar loading, and leaderboard features before republishing the upgraded world. The key idea is that the skill repository gives the AI IDE the right workflow rules and platform constraints, so it can operate reliably in the real VIVERSE app lifecycle rather than only on localhost.